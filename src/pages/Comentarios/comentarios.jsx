import { Sidebar } from "../../components/sidebar";
import TextBrilloso from "../../components/textoBrilloso";
import { TopbarandUser } from "../../components/topbaranduser";
import "../../styles/comentarios.css";
export function Comentarios() {
  return (
    <>
      <Sidebar />
      <div className="main">
        <TopbarandUser />
        <div className="container">
          <br />
          <TextBrilloso name={"comentarios"}/>
          <br /><br />
          <div class="messages">
            <div class="message-box">
              <div class="message-content">
                <div class="message-header">
                  <div class="name">Stephanie</div>
                  <div class="star-checkbox">
                    <input type="checkbox" id="star-1" />
                    <label for="star-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-star"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </label>
                  </div>
                </div>
                <p class="message-line">
                  I got your first assignment. It was quite good. 🥳 We can
                  continue with the next assignment.
                </p>
                <p class="message-line time">Dec, 12</p>
              </div>
            </div>
            <div class="message-box">
              <div class="message-content">
                <div class="message-header">
                  <div class="name">Mark</div>
                  <div class="star-checkbox">
                    <input type="checkbox" id="star-2" />
                    <label for="star-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-star"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </label>
                  </div>
                </div>
                <p class="message-line">
                  Hey, can tell me about progress of project? I'm waiting for
                  your response.
                </p>
                <p class="message-line time">Dec, 12</p>
              </div>
            </div>
            <div class="message-box">
              <div class="message-content">
                <div class="message-header">
                  <div class="name">David</div>
                  <div class="star-checkbox">
                    <input type="checkbox" id="star-3" />
                    <label for="star-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-star"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </label>
                  </div>
                </div>
                <p class="message-line">
                  Awesome! 🤩 I like it. We can schedule a meeting for the next
                  one.
                </p>
                <p class="message-line time">Dec, 12</p>
              </div>
            </div>
            <div class="message-box">
              <div class="message-content">
                <div class="message-header">
                  <div class="name">Jessica</div>
                  <div class="star-checkbox">
                    <input type="checkbox" id="star-4" />
                    <label for="star-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-star"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </label>
                  </div>
                </div>
                <p class="message-line">
                  I am really impressed! Can't wait to see the final result.
                </p>
                <p class="message-line time">Dec, 11</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
