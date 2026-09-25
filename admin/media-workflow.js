export const initMediaWorkflow = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#mediaWorkflowNavButton");
  const state = document.querySelector("#mediaWorkflowState");
  const message = document.querySelector("#mediaWorkflowMessage");
  const refreshButton = document.querySelector("#mediaWorkflowRefreshButton");
  const storageDot = document.querySelector("#mediaStorageDot");
  const storageStatus = document.querySelector("#mediaStorageStatus");
  const metadataDot = document.querySelector("#mediaMetadataDot");
  const metadataStatus = document.querySelector("#mediaMetadataStatus");
  const metadataCount = document.querySelector("#mediaMetadataCount");

  const uploadForm = document.querySelector("#mediaUploadForm");
  const sourceInput = document.querySelector("#mediaSourceInput");
  const altTextInput = document.querySelector("#mediaAltTextInput");
  const displayWidthInput = document.querySelector("#mediaDisplayWidthInput");
  const thumbnailWidthInput = document.querySelector("#mediaThumbnailWidthInput");
  const thumbnailAspectInput = document.querySelector("#mediaThumbnailAspectInput");
  const outputFormatInput = document.querySelector("#mediaOutputFormatInput");
  const qualityInput = document.querySelector("#mediaQualityInput");
  const qualityValue = document.querySelector("#mediaQualityValue");
  const preservePngInput = document.querySelector("#mediaPreservePngInput");
  const uploadButton = document.querySelector("#mediaOptimizeUploadButton");
  const uploadStatus = document.querySelector("#mediaUploadStatus");

  const sourcePreviewImage = document.querySelector("#mediaSourcePreviewImage");
  const sourcePreviewEmpty = document.querySelector("#mediaSourcePreviewEmpty");
  const sourceSize = document.querySelector("#mediaSourceSize");
  const sourceDimensions = document.querySelector("#mediaSourceDimensions");
  const sourceAspect = document.querySelector("#mediaSourceAspect");
  const sourceFormat = document.querySelector("#mediaSourceFormat");

  const outputPreview = document.querySelector("#mediaOutputPreview");
  const displayPreviewImage = document.querySelector("#mediaDisplayPreviewImage");
  const thumbnailPreviewImage = document.querySelector("#mediaThumbnailPreviewImage");
  const displayPreviewMeta = document.querySelector("#mediaDisplayPreviewMeta");
  const thumbnailPreviewMeta = document.querySelector("#mediaThumbnailPreviewMeta");

  const libraryGrid = document.querySelector("#mediaLibraryGrid");
  const libraryCount = document.querySelector("#mediaLibraryCount");

  if (!navButton || !uploadForm) return;

  const BUCKET = "portfolio-media";
  const SOURCE_MAX_BYTES = 25 * 1024 * 1024;
  const OUTPUT_MAX_BYTES = 8 * 1024 * 1024;
  const SOURCE_MAX_PIXELS = 60000000;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  let sourceObjectUrl = "";
  let displayObjectUrl = "";
  let thumbnailObjectUrl = "";

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setUploadStatus = (value = "") => {
    if (uploadStatus) uploadStatus.textContent = value;
  };

  const setCheck = (dot, labelElement, checkState, label) => {
    if (dot) {
      dot.classList.remove("checking", "ready", "missing");
      dot.classList.add(checkState);
    }
    if (labelElement) labelElement.textContent = label;
  };

  const formatBytes = (bytes) => {
    const value = Number(bytes || 0);
    if (!Number.isFinite(value) || value <= 0) return "0 KB";
    if (value < 1024 * 1024) return Math.max(1, Math.round(value / 1024)) + " KB";
    return (value / (1024 * 1024)).toFixed(2) + " MB";
  };

  const gcd = (a, b) => {
    let x = Math.abs(Math.round(a));
    let y = Math.abs(Math.round(b));
    while (y) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x || 1;
  };

  const formatAspect = (width, height) => {
    if (!width || !height) return "—";
    const divisor = gcd(width, height);
    const ratioW = Math.round(width / divisor);
    const ratioH = Math.round(height / divisor);
    if (ratioW <= 50 && ratioH <= 50) return ratioW + ":" + ratioH;
    return (width / height).toFixed(2) + ":1";
  };

  const sanitizeName = (name) => {
    const base = String(name || "image")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    return base || "image";
  };

  const createMediaId = () => {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));
    return (
      hex.slice(0, 4).join("") + "-" +
      hex.slice(4, 6).join("") + "-" +
      hex.slice(6, 8).join("") + "-" +
      hex.slice(8, 10).join("") + "-" +
      hex.slice(10, 16).join("")
    );
  };

  const revokeObjectUrl = (kind) => {
    let current = "";
    if (kind === "source") current = sourceObjectUrl;
    if (kind === "display") current = displayObjectUrl;
    if (kind === "thumbnail") current = thumbnailObjectUrl;
    if (current) URL.revokeObjectURL(current);
    if (kind === "source") sourceObjectUrl = "";
    if (kind === "display") displayObjectUrl = "";
    if (kind === "thumbnail") thumbnailObjectUrl = "";
  };

  const loadImage = (file) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        resolve({
          image,
          objectUrl,
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read this image."));
      };

      image.src = objectUrl;
    });

  const canvasToBlob = (canvas, mimeType, quality) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Browser could not create the optimized image."));
            return;
          }
          resolve(blob);
        },
        mimeType,
        quality
      );
    });

  const resolveOutputType = (file) => {
    const choice = outputFormatInput.value || "auto";

    if (choice === "png") return { mime: "image/png", ext: "png" };
    if (choice === "jpeg") return { mime: "image/jpeg", ext: "jpg" };
    if (choice === "webp") return { mime: "image/webp", ext: "webp" };

    if (file.type === "image/png" && preservePngInput.checked) {
      return { mime: "image/png", ext: "png" };
    }

    return { mime: "image/webp", ext: "webp" };
  };

  const drawNatural = async (image, sourceWidth, sourceHeight, maxWidth, outputType, quality) => {
    const width = Math.min(sourceWidth, maxWidth);
    const height = Math.max(1, Math.round(sourceHeight * (width / sourceWidth)));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", {
      alpha: outputType.mime !== "image/jpeg"
    });

    if (!context) throw new Error("Canvas is unavailable in this browser.");

    if (outputType.mime === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, outputType.mime, quality);
    return { blob, width, height };
  };

  const drawThumbnail = async (
    image,
    sourceWidth,
    sourceHeight,
    targetWidth,
    aspectChoice,
    outputType,
    quality
  ) => {
    if (aspectChoice === "natural") {
      return drawNatural(
        image,
        sourceWidth,
        sourceHeight,
        Math.min(sourceWidth, targetWidth),
        outputType,
        quality
      );
    }

    const ratioParts = aspectChoice.split(":").map(Number);
    const ratioW = ratioParts[0];
    const ratioH = ratioParts[1];
    const targetHeight = Math.max(1, Math.round(targetWidth * (ratioH / ratioW)));
    const targetRatio = ratioW / ratioH;
    const sourceRatio = sourceWidth / sourceHeight;

    let sx = 0;
    let sy = 0;
    let sw = sourceWidth;
    let sh = sourceHeight;

    if (sourceRatio > targetRatio) {
      sw = sourceHeight * targetRatio;
      sx = (sourceWidth - sw) / 2;
    } else {
      sh = sourceWidth / targetRatio;
      sy = (sourceHeight - sh) / 2;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d", {
      alpha: outputType.mime !== "image/jpeg"
    });

    if (!context) throw new Error("Canvas is unavailable in this browser.");

    if (outputType.mime === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, targetWidth, targetHeight);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

    const blob = await canvasToBlob(canvas, outputType.mime, quality);
    return { blob, width: targetWidth, height: targetHeight };
  };

  const clearSourceInspection = () => {
    revokeObjectUrl("source");
    sourcePreviewImage.hidden = true;
    sourcePreviewImage.removeAttribute("src");
    sourcePreviewEmpty.hidden = false;
    sourceSize.textContent = "—";
    sourceDimensions.textContent = "—";
    sourceAspect.textContent = "—";
    sourceFormat.textContent = "—";
  };

  const inspectSource = async (file) => {
    clearSourceInspection();
    revokeObjectUrl("display");
    revokeObjectUrl("thumbnail");
    outputPreview.hidden = true;
    displayPreviewImage.removeAttribute("src");
    thumbnailPreviewImage.removeAttribute("src");

    if (!file) return null;

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Use JPG, PNG or WebP.");
    }

    if (file.size > SOURCE_MAX_BYTES) {
      throw new Error("Source image is larger than 25 MB.");
    }

    const loaded = await loadImage(file);
    sourceObjectUrl = loaded.objectUrl;

    if (loaded.width * loaded.height > SOURCE_MAX_PIXELS) {
      revokeObjectUrl("source");
      throw new Error("Source image is too large to process safely. Use an image under 60 megapixels.");
    }

    sourcePreviewImage.src = sourceObjectUrl;
    sourcePreviewImage.alt = altTextInput.value.trim() || "Selected source image preview";
    sourcePreviewImage.hidden = false;
    sourcePreviewEmpty.hidden = true;
    sourceSize.textContent = formatBytes(file.size);
    sourceDimensions.textContent = loaded.width + " × " + loaded.height + " px";
    sourceAspect.textContent = formatAspect(loaded.width, loaded.height);
    sourceFormat.textContent = file.type.replace("image/", "").toUpperCase();

    return loaded;
  };

  const copyText = async (value, button) => {
    const textValue = String(value || "").trim();
    if (!textValue) return;

    try {
      await navigator.clipboard.writeText(textValue);
      const original = button.textContent;
      button.textContent = "Copied ✓";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    } catch {
      window.prompt("Copy this URL:", textValue);
    }
  };

  const renderLibrary = (rows = []) => {
    libraryGrid.innerHTML = "";
    libraryCount.textContent = rows.length + (rows.length === 1 ? " item" : " items");

    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "media-library-empty";
      empty.textContent = "No optimized project media yet.";
      libraryGrid.appendChild(empty);
      return;
    }

    rows.forEach((item) => {
      const card = document.createElement("article");
      card.className = "media-library-card";
      card.dataset.mediaId = item.id;

      const image = document.createElement("img");
      image.src = item.thumbnail_url || item.display_url;
      image.alt = item.alt_text || "";

      const body = document.createElement("div");
      body.className = "media-library-body";

      const title = document.createElement("strong");
      title.textContent = item.original_filename;

      const alt = document.createElement("p");
      alt.textContent = item.alt_text;

      const meta = document.createElement("small");
      meta.textContent =
        "Display " + item.display_width + "×" + item.display_height +
        " · " + formatBytes(item.display_bytes) +
        " · Thumb " + item.thumbnail_width + "×" + item.thumbnail_height +
        " · " + formatBytes(item.thumbnail_bytes);

      const actions = document.createElement("div");
      actions.className = "media-library-actions";

      const copyDisplay = document.createElement("button");
      copyDisplay.type = "button";
      copyDisplay.className = "secondary-button";
      copyDisplay.textContent = "Copy display URL";
      copyDisplay.addEventListener("click", () => copyText(item.display_url, copyDisplay));

      const copyThumb = document.createElement("button");
      copyThumb.type = "button";
      copyThumb.className = "secondary-button";
      copyThumb.textContent = "Copy thumbnail URL";
      copyThumb.addEventListener("click", () => copyText(item.thumbnail_url, copyThumb));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button media-delete-button";
      remove.textContent = "Delete";
      remove.addEventListener("click", async () => {
        const confirmed = window.confirm(
          'Delete "' + item.original_filename + '" and both optimized files? This cannot be undone.'
        );
        if (!confirmed) return;

        remove.disabled = true;
        remove.textContent = "Deleting…";
        setMessage("");

        const paths = [item.display_path, item.thumbnail_path].filter(Boolean);

        try {
          if (paths.length) {
            const storageDelete = await supabaseClient.storage.from(BUCKET).remove(paths);
            if (storageDelete.error) throw storageDelete.error;
          }

          const rowDelete = await supabaseClient
            .from("portfolio_media")
            .delete()
            .eq("id", item.id);

          if (rowDelete.error) throw rowDelete.error;

          setMessage("Media item and optimized files deleted.");
          await loadLibrary();
          await checkFoundation();
        } catch (error) {
          console.error("Media delete failed:", error);
          setMessage(error && error.message ? error.message : "Could not delete this media item.");
          remove.disabled = false;
          remove.textContent = "Delete";
        }
      });

      actions.append(copyDisplay, copyThumb, remove);
      body.append(title, alt, meta, actions);
      card.append(image, body);
      libraryGrid.appendChild(card);
    });
  };

  const loadLibrary = async () => {
    const result = await supabaseClient
      .from("portfolio_media")
      .select(
        "id,original_filename,alt_text,display_path,display_url,display_width,display_height,display_bytes,thumbnail_path,thumbnail_url,thumbnail_width,thumbnail_height,thumbnail_bytes,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (result.error) {
      renderLibrary([]);
      return false;
    }

    renderLibrary(result.data || []);
    return true;
  };

  const checkFoundation = async () => {
    if (!state) return false;

    refreshButton.disabled = true;
    state.textContent = "Checking…";
    setMessage("Checking media storage and metadata…");
    setCheck(storageDot, storageStatus, "checking", "Checking…");
    setCheck(metadataDot, metadataStatus, "checking", "Checking…");
    metadataCount.textContent = "—";

    const results = await Promise.all([
      supabaseClient.storage.from(BUCKET).list("projects/library", { limit: 1 }),
      supabaseClient.from("portfolio_media").select("id", { head: true, count: "exact" })
    ]);

    const storageResult = results[0];
    const metadataResult = results[1];
    const storageReady = !storageResult.error;
    const metadataReady = !metadataResult.error;

    setCheck(
      storageDot,
      storageStatus,
      storageReady ? "ready" : "missing",
      storageReady ? "Ready" : "Migration required"
    );

    setCheck(
      metadataDot,
      metadataStatus,
      metadataReady ? "ready" : "missing",
      metadataReady ? "Ready" : "Migration required"
    );

    metadataCount.textContent = metadataReady
      ? String(metadataResult.count || 0) + " media items"
      : "Table not available";

    const ready = storageReady && metadataReady;
    state.textContent = ready ? "Media workflow ready" : "Setup required";
    setMessage(
      ready
        ? "Media foundation is ready. Uploads store optimized display + thumbnail files only."
        : "Run supabase/migrations/011_portfolio_media_workflow.sql in Supabase SQL Editor, then click Check again."
    );

    uploadButton.disabled = !ready;
    refreshButton.disabled = false;

    if (ready) await loadLibrary();
    else renderLibrary([]);

    return ready;
  };

  navButton.addEventListener("click", async () => {
    showCmsView("media-workflow");
    await checkFoundation();
  });

  refreshButton.addEventListener("click", checkFoundation);

  qualityInput.addEventListener("input", () => {
    qualityValue.textContent = qualityInput.value + "%";
  });

  altTextInput.addEventListener("input", () => {
    if (!sourcePreviewImage.hidden) {
      sourcePreviewImage.alt = altTextInput.value.trim() || "Selected source image preview";
    }
  });

  sourceInput.addEventListener("change", async () => {
    setUploadStatus("");

    try {
      await inspectSource(sourceInput.files && sourceInput.files[0]);
    } catch (error) {
      console.error("Media source inspection failed:", error);
      setUploadStatus(error && error.message ? error.message : "Could not inspect this image.");
      sourceInput.value = "";
      clearSourceInspection();
    }
  });

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setUploadStatus("");
    setMessage("");

    const file = sourceInput.files && sourceInput.files[0];
    const altText = altTextInput.value.trim();

    if (!file) {
      setUploadStatus("Choose a source image first.");
      return;
    }

    if (!altText) {
      setUploadStatus("Add alt text before uploading.");
      altTextInput.focus();
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadStatus("Use JPG, PNG or WebP.");
      return;
    }

    if (file.size > SOURCE_MAX_BYTES) {
      setUploadStatus("Source image is larger than 25 MB.");
      return;
    }

    uploadButton.disabled = true;
    uploadButton.textContent = "Optimizing…";

    let loaded = null;
    const uploadedPaths = [];

    try {
      loaded = await loadImage(file);

      if (!loaded.width || !loaded.height) {
        throw new Error("Could not read source image dimensions.");
      }

      if (loaded.width * loaded.height > SOURCE_MAX_PIXELS) {
        throw new Error("Source image is too large to process safely. Use an image under 60 megapixels.");
      }

      const displayMaxWidth = Number(displayWidthInput.value || 2000);
      const thumbWidth = Number(thumbnailWidthInput.value || 800);
      const thumbAspect = thumbnailAspectInput.value || "16:10";
      const quality = Number(qualityInput.value || 82) / 100;
      const outputType = resolveOutputType(file);

      setUploadStatus("Creating optimized display image…");
      const display = await drawNatural(
        loaded.image,
        loaded.width,
        loaded.height,
        displayMaxWidth,
        outputType,
        quality
      );

      setUploadStatus("Creating thumbnail…");
      const thumbnail = await drawThumbnail(
        loaded.image,
        loaded.width,
        loaded.height,
        thumbWidth,
        thumbAspect,
        outputType,
        quality
      );

      if (display.blob.size > OUTPUT_MAX_BYTES || thumbnail.blob.size > OUTPUT_MAX_BYTES) {
        throw new Error("Optimized output still exceeds 8 MB. Choose WebP/JPG or a smaller display width.");
      }

      revokeObjectUrl("display");
      revokeObjectUrl("thumbnail");
      displayObjectUrl = URL.createObjectURL(display.blob);
      thumbnailObjectUrl = URL.createObjectURL(thumbnail.blob);

      displayPreviewImage.src = displayObjectUrl;
      displayPreviewImage.alt = altText;
      thumbnailPreviewImage.src = thumbnailObjectUrl;
      thumbnailPreviewImage.alt = altText;
      displayPreviewMeta.textContent =
        display.width + " × " + display.height + " px · " +
        formatBytes(display.blob.size) + " · " + outputType.ext.toUpperCase();
      thumbnailPreviewMeta.textContent =
        thumbnail.width + " × " + thumbnail.height + " px · " +
        formatBytes(thumbnail.blob.size) + " · " + outputType.ext.toUpperCase();
      outputPreview.hidden = false;

      uploadButton.textContent = "Uploading…";
      setUploadStatus("Uploading optimized files…");

      const mediaId = createMediaId();

      const safeName = sanitizeName(file.name);
      const basePath = "projects/library/" + mediaId;
      const displayPath = basePath + "/" + safeName + "-display." + outputType.ext;
      const thumbnailPath = basePath + "/" + safeName + "-thumb." + outputType.ext;

      const displayUpload = await supabaseClient.storage
        .from(BUCKET)
        .upload(displayPath, display.blob, {
          cacheControl: "31536000",
          contentType: outputType.mime,
          upsert: false
        });

      if (displayUpload.error) throw displayUpload.error;
      uploadedPaths.push(displayPath);

      const thumbUpload = await supabaseClient.storage
        .from(BUCKET)
        .upload(thumbnailPath, thumbnail.blob, {
          cacheControl: "31536000",
          contentType: outputType.mime,
          upsert: false
        });

      if (thumbUpload.error) throw thumbUpload.error;
      uploadedPaths.push(thumbnailPath);

      const displayPublic = supabaseClient.storage.from(BUCKET).getPublicUrl(displayPath);
      const thumbPublic = supabaseClient.storage.from(BUCKET).getPublicUrl(thumbnailPath);
      const displayUrl = displayPublic && displayPublic.data && displayPublic.data.publicUrl;
      const thumbUrl = thumbPublic && thumbPublic.data && thumbPublic.data.publicUrl;

      if (!displayUrl || !thumbUrl) {
        throw new Error("Storage did not return public image URLs.");
      }

      setUploadStatus("Saving media metadata…");

      const metadataInsert = await supabaseClient.from("portfolio_media").insert({
        id: mediaId,
        original_filename: file.name,
        alt_text: altText,
        source_mime_type: file.type,
        source_width: loaded.width,
        source_height: loaded.height,
        source_bytes: file.size,
        output_format: outputType.ext,
        thumbnail_aspect: thumbAspect,
        display_path: displayPath,
        display_url: displayUrl,
        display_width: display.width,
        display_height: display.height,
        display_bytes: display.blob.size,
        thumbnail_path: thumbnailPath,
        thumbnail_url: thumbUrl,
        thumbnail_width: thumbnail.width,
        thumbnail_height: thumbnail.height,
        thumbnail_bytes: thumbnail.blob.size
      });

      if (metadataInsert.error) throw metadataInsert.error;

      setUploadStatus(
        "Uploaded ✓ Display " + display.width + "×" + display.height +
        " (" + formatBytes(display.blob.size) + ") · Thumbnail " +
        thumbnail.width + "×" + thumbnail.height +
        " (" + formatBytes(thumbnail.blob.size) + ")"
      );

      uploadForm.reset();
      qualityInput.value = "82";
      qualityValue.textContent = "82%";
      preservePngInput.checked = true;
      clearSourceInspection();

      await loadLibrary();
      await checkFoundation();
    } catch (error) {
      console.error("Media optimize/upload failed:", error);

      if (uploadedPaths.length) {
        const cleanup = await supabaseClient.storage.from(BUCKET).remove(uploadedPaths);
        if (cleanup.error) {
          console.warn("Partial media cleanup failed:", cleanup.error);
        }
      }

      setUploadStatus(
        error && error.message ? error.message : "Could not optimize and upload this image."
      );
    } finally {
      if (loaded && loaded.objectUrl) URL.revokeObjectURL(loaded.objectUrl);
      uploadButton.disabled = false;
      uploadButton.textContent = "Optimize & upload";
    }
  });

  uploadButton.disabled = true;
  renderLibrary([]);
};
