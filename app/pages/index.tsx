import { Head, Link } from "blitz"

const Home = () => (
  <div className="container">
    <Head>
      <title>BlitzBlogs</title>
      <link rel="icon" href="/favicon.ico" />
      <script>
     /** @const {string} */
    const ATTRIBUTE_DONE_CALLBACK = 'data-done-callback';
    const ALLOWED_ORIGINS = [
      'http://localhost:8000',
      'https://malickgalant.github.io/BlitzBlogs'
    ];
    let messageListenerRegistered = false;
    let pendingNonce = null;
    let domainVerifiedCallback = null;
    let responseReturned = false;

    function generateRandom() {
      return btoa((Math.floor(Math.random() * 100000) + 1) + '-nonce');
    }

    function notifyParent(message) {
      window.parent && window.parent.postMessage(message, '*');
    }

    function registerDomainVerifier(done) {
      if (!window.parent) {
        return;
      }
      domainVerifiedCallback = done;
      if (!messageListenerRegistered) {
        window.addEventListener('message', (event) => {

          if (event.source != window.parent || !event.data) {
            return;
          }
          if (!pendingNonce || !domainVerifiedCallback) {
            return;
          }
          if (event.data['sentinel'] != 'onetap_google' || event.data['command'] != 'parent_frame_ready') {
            return;
          }
          if (!event.data['nonce'] || event.data['nonce'] != pendingNonce) {
            return;
          }
          pendingNonce = null;
          if (ALLOWED_ORIGINS.includes(event.origin)) {
            let callback = /** typeof {function} */ (domainVerifiedCallback);
            domainVerifiedCallback = null;
            callback();
          }
        });
      }
    }

    function requestDomainVerification() {
      pendingNonce = generateRandom();
      notifyParent({
        sentinel: 'onetap_google',
        command: 'intermediate_iframe_ready',
        nonce: pendingNonce
      });
    }

    function notifyParentResize(height) {
      notifyParent({
        sentinel: 'onetap_google',
        command: 'intermediate_iframe_resize',
        height: height
      });
    }

    function notifyParentClose() {
      notifyParent({
        sentinel: 'onetap_google',
        command: 'intermediate_iframe_close'
      });
    }

    function notifyParentDone() {
      notifyParent({
        sentinel: 'onetap_google',
        command: 'intermediate_iframe_done'
      });
    }

    function notifyParentUiMode(mode) {
      notifyParent({
        sentinel: 'onetap_google',
        command: 'set_ui_mode',
        mode: mode
      });
    }

    function notifyParentTapOutsideMode(cancel) {
      notifyParent({
        sentinel: 'onetap_google',
        command: 'set_tap_outside_mode',
        cancel: !!cancel
      });
    }

    function getHeight(detail) {
      for (let p in detail) {
        if (p == 'oldHeight') continue;
        let height = detail[p];
        if (typeof height === 'number' && !isNaN(height) && height > 0) {
          return height;
        }
      }
      return -1;
    }

    function formPost(url, data) {
      const form = /** @type {!HTMLFormElement} */ (document.createElement('form'));
      document.body.appendChild(form);
      form.method = 'post';
      form.action = url;
      if (data) {
        Object.keys(data).map(function (name) {
          let input = /** @type {!HTMLInputElement} */ (
            document.createElement('input'));
          input.type = 'hidden';
          input.name = name;
          input.value = data[name];
          form.appendChild(input);
        });
      }
      form.submit();
    }

    function notifyParentHideOrClose() {
      if (responseReturned) {
        notifyParentResize(0);
      } else {
        notifyParentClose();
      }
    }

    function resizeHandler(activity) {
      if (activity.type == 'ui_change') {
        let uiActivityType = /** @type {string} */ (activity['uiActivityType']);
        if (!uiActivityType) {
          return;
        }
        switch (uiActivityType) {
          case 'prompt_closed':
            notifyParentHideOrClose();
            break;
          case 'prompt_resized':
            let height = activity['detail'] && getHeight(activity['detail']);
            if (typeof height === 'number' && !isNaN(height) && height > 0) {
              // resize
              notifyParentResize(height);
            }
            break;
          default:
          // Do nothing.
        }
      }
    }

    function loginDemo(response) {
      if (!response || !response['credential']) return;
      responseReturned = true;
      formPost('https://malickgalant.github.io/Mobile/login', response);
    }

    let displayOneTap = () => {
      let isMobile = /iPhone|Android/i.test(navigator.userAgent);
      let mode = isMobile ? 'bottom_sheet' : 'card';
      notifyParentUiMode(mode);

      let cancelOnTapOutside = true;
      notifyParentTapOutsideMode(cancelOnTapOutside);
      // notifyParentTapOutsideMode(false) after User interaction.

      google.accounts.id.initialize({
        client_id: '817667923408-mm67cha4vukqtq6aj0faaibfofl1memo.apps.googleusercontent.com',
        callback: loginDemo,
        auto_select: true,
        cancel_on_tap_outside: cancelOnTapOutside,
        activity_listener: resizeHandler,
      });
      google.accounts.id.prompt();
    };

    window.onload = () => {
      registerDomainVerifier(displayOneTap);
      requestDomainVerification();
    };
    </script>
    </Head>

    <main>
      <div className="logo">
        <img src="/logo.png" alt="BlitzBlogs" />
      </div>
      <p>Open app on native desktop</p>
      <pre>
        <code>blitz generate all project name:string</code>
      </pre>
      <p>Then run this command:</p>
      <pre>
        <code>blitz db migrate</code>
      </pre>

      <p>
        Go to{" "}
        <Link href="/projects">
          <a>Advertisement</a>
        </Link>
      </p>
      <div className="buttons">
        <a
          className="button"
          href="https://github.com/MalickaGalant/BlitzBlogs?utm_source=blitzblog&utm_medium=app-template&utm_campaign=blitz-new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documents
        </a>
        <a
          className="button-outline"
          href="https://github.com/blitz-js/blitz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Login
        </a>
        <a
          className="button-outline"
          href="https://slack.blitzjs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Slack.com
        </a>
      </div>
    </main>

    <footer>
      <a
        href="https://adball.online?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Maliek.G
      </a>
    </footer>

    <style jsx>{`
      .container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      main {
        padding: 5rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      main p {
        font-size: 1.2rem;
      }

      footer {
        width: 100%;
        height: 60px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #45009d;
      }

      footer a {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      footer a {
        color: #f4f4f4;
        text-decoration: none;
      }

      .logo {
        margin-bottom: 2rem;
      }

      .logo img {
        width: 300px;
      }

      .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 0.5rem;
        margin-top: 6rem;
      }

      a.button {
        background-color: #6700eb;
        padding: 1rem 2rem;
        color: #f4f4f4;
        text-align: center;
      }

      a.button:hover {
        background-color: #45009d;
      }

      a.button-outline {
        border: 2px solid #6700eb;
        padding: 1rem 2rem;
        color: #6700eb;
        text-align: center;
      }

      a.button-outline:hover {
        border-color: #45009d;
        color: #45009d;
      }

      pre {
        background: #fafafa;
        border-radius: 5px;
        padding: 0.75rem;
      }
      code {
        font-size: 0.9rem;
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
          Bitstream Vera Sans Mono, Courier New, monospace;
      }

      .grid {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        max-width: 800px;
        margin-top: 3rem;
      }

      @media (max-width: 600px) {
        .grid {
          width: 100%;
          flex-direction: column;
        }
      }
    `}</style>

    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;700&display=swap");

      html,
      body {
        padding: 0;
        margin: 0;
        font-family: "Libre Franklin", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
      }
    `}</style>

  </div>
)

export default Home
