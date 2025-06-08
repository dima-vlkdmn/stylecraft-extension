const copyToClipboard = (content: string, callbacks?: { onSuccess?: () => void, onFail?: () => void }) => {
  navigator.clipboard.writeText(content)
    .then(() => callbacks?.onSuccess?.())
    .catch(() => callbacks?.onFail?.());
};

export { copyToClipboard };