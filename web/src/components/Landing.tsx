import React, { ReactElement } from "react";

import "./Landing.css";

export const Landing = React.memo<{
  hideHowto?: boolean;
  children?: ReactElement;
}>(({ children, hideHowto }) => (
  <div className="Landing-container">
    <img
      src="https://github.com/dai-shi/remote-faces/raw/master/images/logo.png"
      alt="logo"
    />
    {children}
    <div className="Landing-features">
      <div>
        <h1>See faces of your friends or colleagues remotely</h1>
        <p>
          The key feature of this app is to share webcam still images to see
          each other. Images are just 72px square and only updated every two
          minutes. They are so small that you can place the window all the time
          near the left edge of your desktop. Images are sent each other in a
          peer-to-peer manner and not stored anywhere. The link represents a
          virtual room and all room members can see each other. Be careful not
          to leak the link to unwanted person.
        </p>
      </div>
      <div>
        <h1>Opt-in Live Mode and Momentary Chat</h1>
        <p>
          In case you want to feel more connected, you can enable Live Mode and
          your image become a video. If speaker and mic is activated, you can
          talk with others who too enable the Live Mode. There is a chat area
          next to face images where you can text. The chat is visible to all
          members in the room. The chat history is only available until some
          mebers are in the room. It will disappear if everyone close the room
          in the browser. (Note: the link itself is still effective.)
        </p>
      </div>
      <div>
        <h1>Other tools for collaboration</h1>
        <p>
          There is another area next to the chat area. Members can do
          collaborative work there. Currently, there are three features are
          included. 1) Screen Share: Share screen video of your desktop or
          window. 2) Share Video: In addition to the small images, you can share
          bigger images. This does not have to be the same webcam image. 3)
          White Board: Powered by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://excalidraw.com"
          >
            Excalidraw
          </a>
          . This allows to work with a shared white board. White board data will
          go through the server to synchronzize, but the data is encrypted and
          the server is unable to see its content.
        </p>
      </div>
    </div>
    {!hideHowto && (
      <div className="Landing-howto">
        <h2>Getting started</h2>
        <ol>
          <li>
            You or someone needs to create a new room. Just click the button and
            it will issue a unique link.
          </li>
          <li>
            Copy the link from the browser address bar and send it to your
            friends or colleagues. If you receive the link, open it in the
            browser. It may take several seconds for everyone sees each other.
            If it keeps unconnected more than two minutes, there can be a
            connectivity issue. Sometimes, reloading the page in the browser
            solves the situation.
          </li>
          <li>
            If it is the first time to run this app, the browser will prompt the
            permission for webcam. After allowing the permisson, you may need to
            reload the page in the browser to make the psermission effective.
          </li>
        </ol>
      </div>
    )}
  </div>
));

export default Landing;
