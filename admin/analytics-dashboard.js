const RANGE_DAYS = new Set([7, 30, 90]);

const formatNumber = (value) =>
  new Intl.NumberFormat().format(Number(value || 0));

const labelize = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const aggregate = (items, keyFn) => {
  const counts = new Map();

  items.forEach((item) => {
    const key = keyFn(item);
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

export const initAnalyticsDashboard = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#analyticsNavButton");
  const editor = document.querySelector("#analyticsEditor");
  const state = document.querySelector("#analyticsState");
  const message = document.querySelector("#analyticsMessage");
  const refreshButton = document.querySelector("#analyticsRefreshButton");
  const rangeSelect = document.querySelector("#analyticsRange");
  const visitsValue = document.querySelector("#analyticsVisits");
  const pageViewsValue = document.querySelector("#analyticsPageViews");
  const projectViewsValue = document.querySelector("#analyticsProjectViews");
  const contactClicksValue = document.querySelector("#analyticsContactClicks");
  const projectList = document.querySelector("#analyticsTopProjects");
  const contactList = document.querySelector("#analyticsTopContacts");
  const projectEmpty = document.querySelector("#analyticsProjectsEmpty");
  const contactEmpty = document.querySelector("#analyticsContactsEmpty");

  if (
    !navButton ||
    !editor ||
    !rangeSelect ||
    !visitsValue ||
    !pageViewsValue ||
    !projectViewsValue ||
    !contactClicksValue ||
    !projectList ||
    !contactList
  ) {
    return;
  }

  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    refreshButton.disabled = value;
    rangeSelect.disabled = value;
  };

  const renderRankedList = (root, empty, rows, type) => {
    root.replaceChildren();

    const visible = rows.slice(0, 8);
    if (empty) empty.hidden = visible.length > 0;

    const max = visible[0]?.[1] || 1;

    visible.forEach(([key, count], index) => {
      const item = document.createElement("article");
      item.className = "analytics-rank-item";

      const rank = document.createElement("span");
      rank.className = "analytics-rank-number";
      rank.textContent = String(index + 1).padStart(2, "0");

      const copy = document.createElement("div");
      copy.className = "analytics-rank-copy";

      const top = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = type === "project" ? labelize(key) : labelize(key);
      const total = document.createElement("span");
      total.textContent = formatNumber(count);
      top.append(name, total);

      const bar = document.createElement("div");
      bar.className = "analytics-rank-bar";
      const fill = document.createElement("i");
      fill.style.width = Math.max(8, Math.round((count / max) * 100)) + "%";
      bar.appendChild(fill);

      copy.append(top, bar);
      item.append(rank, copy);
      root.appendChild(item);
    });
  };

  const render = (events) => {
    const pageViews = events.filter((item) => item.event_type === "page_view");
    const projectViews = events.filter(
      (item) => item.event_type === "project_view"
    );
    const contactClicks = events.filter(
      (item) => item.event_type === "contact_click"
    );

    const visits = new Set(
      pageViews.map((item) => item.session_id).filter(Boolean)
    ).size;

    visitsValue.textContent = formatNumber(visits);
    pageViewsValue.textContent = formatNumber(pageViews.length);
    projectViewsValue.textContent = formatNumber(projectViews.length);
    contactClicksValue.textContent = formatNumber(contactClicks.length);

    const projects = aggregate(
      projectViews,
      (item) => item.project_slug || item.event_key
    );

    const contacts = aggregate(
      contactClicks,
      (item) => item.event_key
    );

    renderRankedList(projectList, projectEmpty, projects, "project");
    renderRankedList(contactList, contactEmpty, contacts, "contact");

    document.documentElement.dataset.analyticsLoaded = "true";
  };

  const loadData = async () => {
    const days = Number(rangeSelect.value);
    const rangeDays = RANGE_DAYS.has(days) ? days : 30;
    const since = new Date(Date.now() - rangeDays * 86400000).toISOString();

    setBusy(true);
    setState("Loading…");
    setMessage("Loading analytics…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_analytics_events")
        .select(
          "event_type,event_key,page_path,project_slug,session_id,created_at"
        )
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);

      if (error) {
        if (/portfolio_analytics_events/i.test(error.message || "")) {
          throw new Error(
            "Phase 5B analytics table is missing. Run migration 015_analytics_dashboard.sql first."
          );
        }
        throw error;
      }

      const events = data || [];
      render(events);
      setState(rangeDays + " day view");
      setMessage(
        events.length
          ? formatNumber(events.length) +
              " analytics events loaded for the selected period."
          : "No analytics data yet. Visit the portfolio locally after migration 015 is installed."
      );

      return true;
    } catch (error) {
      console.error("Analytics dashboard load failed:", error);
      render([]);
      setState("Load failed");
      setMessage(error?.message || "Could not load analytics.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  rangeSelect.addEventListener("change", loadData);
  refreshButton.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("analytics");
    await loadData();
  });

  render([]);
  setBusy(busy);
};
