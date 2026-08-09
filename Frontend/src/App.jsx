import { useState } from "react";
import axios from "axios";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>
      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onInput={(e) => setUrl(e.currentTarget.value)}
          onPaste={(e) => {
            try {
              const paste = (e.clipboardData || window.clipboardData).getData('text');
              // Append pasted text at cursor by default
              setUrl((prev) => {
                const input = e.target;
                const start = input.selectionStart || 0;
                const end = input.selectionEnd || 0;
                return prev.slice(0, start) + paste + prev.slice(end);
              });
              e.preventDefault();
            } catch (err) {
              // fallback: just read from navigator.clipboard
              navigator.clipboard.readText().then((text) => setUrl((prev) => prev + text)).catch(() => {});
            }
          }}
        />
        <button
          onClick={handleShorten}
          className="btn btn-primary w-full sm:auto"
          disabled={loading}
        >
          Shorten
        </button>
      </div>
      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p className="font-medium mb-2">Your short link:</p>
          <a
            className="link link-primary break-all"
            target="_blank"
            href={shortUrl}
          >
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            className={`btn mt-2 w-full ${
              copied ? "btn-success" : "btn-secondary"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <div className="bg-white p-4 rounded-lg shadow mt-6 flex flex-col items-center">
            <p className="mb-2 text-center font-semibold text-gray-800">
              Scan QR Code:
            </p>
            {qrImage ? (
              <img src={qrImage} alt="QR code" width={180} height={180} />
            ) : (
              <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center">QR</div>
            )}
          </div>
          {qrImage && (
            <a
              className="btn btn-accent mt-3 w-full"
              download="qr-code.png"
              href={qrImage}
            >
              Download QR Code
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App;