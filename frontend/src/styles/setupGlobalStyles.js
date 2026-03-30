let isSetup = false;

export function setupGlobalStyles() {
  if (isSetup) return;

  const fontLinkId = "lp-solver-fonts";
  if (!document.getElementById(fontLinkId)) {
    const fontLink = document.createElement("link");
    fontLink.id = fontLinkId;
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(fontLink);
  }

  const styleId = "lp-solver-global-style";
  if (!document.getElementById(styleId)) {
    const globalStyle = document.createElement("style");
    globalStyle.id = styleId;
    globalStyle.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Manrope', sans-serif;
        background:
          radial-gradient(1200px 600px at 20% -10%, #dfe3ff 0%, transparent 50%),
          radial-gradient(1000px 500px at 100% 0%, #ced8ff 0%, transparent 45%),
          #aeb6e2;
      }
      .mono { font-family: 'JetBrains Mono', monospace; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: #edf0ff; }
      ::-webkit-scrollbar-thumb { background: #c0c6ea; border-radius: 999px; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse-ring { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.5} }
      .fade-in { animation: fadeIn 0.35s ease both; }
      .solving-dot { animation: pulse-ring 1.2s ease-in-out infinite; }
      .tab-cell-highlight { box-shadow: inset 0 0 0 2px #d9a54a; }

      .app-shell {
        min-height: 100vh;
        padding: 18px;
      }

      .app-window {
        display: flex;
        height: calc(100vh - 36px);
        border-radius: 34px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.66);
        border: 1px solid rgba(255, 255, 255, 0.48);
        backdrop-filter: blur(16px);
        box-shadow: 0 32px 70px rgba(74, 78, 125, 0.22);
      }

      .brand-text {
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: -0.02em;
      }

      .soft-card {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid #d9ddf5;
        box-shadow: 0 10px 24px rgba(102, 109, 167, 0.12);
      }

      @media (max-width: 960px) {
        .app-shell {
          padding: 10px;
        }

        .app-window {
          height: calc(100vh - 20px);
          border-radius: 24px;
        }

        .sidebar-wide-text {
          display: none;
        }
      }

      @media (max-width: 720px) {
        .app-window {
          flex-direction: column;
          overflow: auto;
          height: auto;
          min-height: calc(100vh - 20px);
        }

        .app-sidebar {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(globalStyle);
  }

  isSetup = true;
}
