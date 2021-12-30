import { ReactElement, memo } from "react";

import "./Landing.css";

export const Landing = memo<{
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
        <h1>Face List and Gather Area</h1>
        <p>
          On the left of the screen, you will see faces in a column, which we
          call face list and the rest is what we call gather area. In the gather
          area, you can drag your avatar, and the location is shared with
          others. We can define regions in the gather area. Regions can be just
          background or add some features. There is a preset you can choose when
          creating a new room.
        </p>
      </div>
      <div>
        <h1>Real-time communication</h1>
        <p>
          One of the regions is called &quot;Meeting&quot; in which you can talk
          with others in the same meeting region. The face becomes a small video
          in the meeting region. We can create as many meeting regions as we
          want. There is another region called &quot;Media&quot;, with which we
          can share screens and videos in high resolution. &quot;Chat&quot;
          region is to text. The chat texts are not stored anywhere other than
          all connected peers.
        </p>
      </div>
    </div>
    {!hideHowto && (
      <div className="Landing-howto">
        <h2>Getting started</h2>
        <ol>
          <li>
            You or someone needs to create a new room. Just click the
            &quot;Create a new room&quot; button and it will issue a unique
            link.
          </li>
          <li>
            Copy the link from the browser address bar and send it to your
            friends or colleagues. If you receive the link, open it in the
            browser. It may take several seconds for everyone to see each other.
            If it keeps unconnected more than two minutes, there can be a
            connectivity issue. Sometimes, reloading the page in the browser
            solves the situation.
          </li>
          <li>
            If it is the first time to run this app, the browser will prompt the
            permission for camera and microphone. It may also ask permission for
            notification.
          </li>
        </ol>
      </div>
    )}
  </div>
));

export default Landing;
