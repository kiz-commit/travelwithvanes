/** True for QuickTime / .mov uploads that many browsers struggle to play. */
export function isMovFile(file: File): boolean {
  return (
    file.type === "video/quicktime" ||
    file.type === "video/x-quicktime" ||
    /\.mov$/i.test(file.name)
  );
}

function waitForEvent(
  target: EventTarget,
  event: string,
  timeoutMs = 30_000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${event}`));
    }, timeoutMs);
    const onOk = () => {
      cleanup();
      resolve();
    };
    const onErr = () => {
      cleanup();
      reject(new Error(`Media error while waiting for ${event}`));
    };
    const cleanup = () => {
      window.clearTimeout(t);
      target.removeEventListener(event, onOk);
      target.removeEventListener("error", onErr);
    };
    target.addEventListener(event, onOk, { once: true });
    target.addEventListener("error", onErr, { once: true });
  });
}

type CaptureCapableVideo = HTMLVideoElement & {
  captureStream?: () => MediaStream;
  mozCaptureStream?: () => MediaStream;
};

function captureVideoStream(video: HTMLVideoElement): MediaStream | null {
  const v = video as CaptureCapableVideo;
  if (typeof v.captureStream === "function") return v.captureStream();
  if (typeof v.mozCaptureStream === "function") return v.mozCaptureStream();
  return null;
}

/**
 * Re-encode a .mov (or any browser-decodable video) to WebM or MP4 via MediaRecorder.
 * Throws if the browser cannot decode or record the file.
 */
export async function convertVideoToWebm(file: File): Promise<File> {
  if (typeof window === "undefined") {
    throw new Error("Video conversion is only available in the browser");
  }
  if (typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot convert video");
  }

  const mimeCandidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  const mimeType =
    mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? null;
  if (!mimeType) {
    throw new Error("This browser cannot record converted video");
  }
  const outExt = mimeType.startsWith("video/mp4") ? "mp4" : "webm";
  const outMime = outExt === "mp4" ? "video/mp4" : "video/webm";

  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = objectUrl;

  try {
    await waitForEvent(video, "loadeddata");
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error("Could not read video dimensions — try exporting as MP4");
    }

    await video.play().catch(() => {
      /* muted autoplay should usually succeed */
    });

    const stream = captureVideoStream(video);
    if (!stream) {
      throw new Error("This browser cannot capture video for conversion");
    }

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    const done = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onerror = () => reject(new Error("Recording failed"));
      recorder.onstop = () => resolve(new Blob(chunks, { type: outMime }));
    });

    recorder.start(250);
    video.currentTime = 0;
    await video.play();
    const durationMs = Math.max(
      60_000,
      ((Number.isFinite(video.duration) ? video.duration : 60) || 60) * 1000 +
        5_000
    );
    await waitForEvent(video, "ended", durationMs);
    if (recorder.state !== "inactive") recorder.stop();
    stream.getTracks().forEach((t) => t.stop());
    video.pause();

    const blob = await done;
    if (blob.size < 1000) {
      throw new Error("Converted file was empty — try exporting as MP4 instead");
    }

    const base = file.name.replace(/\.mov$/i, "") || "video";
    return new File([blob], `${base}.${outExt}`, { type: outMime });
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Convert .mov to WebM when possible; otherwise return the original file.
 */
export async function prepareVideoForUpload(
  file: File
): Promise<{ file: File; converted: boolean; warning?: string }> {
  if (!isMovFile(file)) {
    return { file, converted: false };
  }

  try {
    const converted = await convertVideoToWebm(file);
    return { file: converted, converted: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not convert .mov";
    return {
      file,
      converted: false,
      warning: `${message}. Uploading original .mov — MP4 plays more reliably in Chrome.`,
    };
  }
}
