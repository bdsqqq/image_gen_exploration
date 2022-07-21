import { useRef, useState } from "preact/hooks";
import domtoimage from "dom-to-image-more";
import "./app.css";

export function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState();

  const [isHidden, setIsHidden] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            setIsHidden((isHidden) => !isHidden);
          }}
        >
          {isHidden ? "show" : "hide"} preview
        </button>

        <textarea
          onChange={(e) => {
            setText(e.currentTarget.value);
          }}
          placeholder="Let's create..."
          style={{ fontSize: "1.5rem", padding: "0.5rem" }}
          type="text"
        />

        <button
          onClick={() => {
            if (ref.current) {
              domtoimage
                .toJpeg(ref.current, {
                  quality: 0.95,
                  height: 1080,
                  width: 1080,
                })
                .then((image) => {
                  // download image
                  let link = document.createElement("a");
                  link.download = "my-image-name.jpeg";
                  link.href = image;
                  link.click();
                });
            }
          }}
        >
          Download image
        </button>
      </div>

      <div style={{ width: "100%", transform: "scale(0.3)" }}>
        <Frame
          hidden={isHidden}
          reference={ref}
          image={{
            src: "https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=520&q=80",
            alt: "Abstract forms",
          }}
          text={text}
        />
      </div>
    </div>
  );
}

const Frame = ({
  hidden,
  text,
  image,
  reference,
}: {
  hidden?: boolean;
  text: string;
  image: {
    src: string;
    alt: string;
  };
  reference: preact.RefObject<HTMLDivElement>;
}) => {
  return (
    <div style={{ display: hidden ? "none" : "block" }}>
      <div
        ref={reference}
        style={{
          aspectRatio: "1/1",
          backgroundColor: "#333",
          width: "1080px",
          height: "auto",
          padding: "4rem",

          display: "grid",

          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "6rem",
            lineHeight: ".9",
            textAlign: "left",

            maxWidth: "90%",
          }}
        >
          {text}
        </h2>

        <img
          style={{
            alignSelf: "end",
            justifySelf: "end",
          }}
          width={520}
          height={520}
          src={image.src}
          alt={image.alt}
        />
      </div>
    </div>
  );
};
