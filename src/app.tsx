import { useRef, useState } from "preact/hooks";
import domtoimage from "dom-to-image-more";
import "./app.css";

import { sizes } from "./data/sizes";
type SizesUnion = keyof typeof sizes;
const sizeKeys = Object.keys(sizes) as unknown as SizesUnion[];

export function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [socialMedia, setSocialMedia] = useState<SizesUnion>(sizeKeys[0]);

  const [isHidden, setIsHidden] = useState(true);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",

        width: "100vw",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
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

        <select
          value={socialMedia}
          onChange={(e) => {
            setSocialMedia(e.currentTarget.value as SizesUnion);
          }}
        >
          {sizeKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            if (ref.current) {
              domtoimage
                .toJpeg(ref.current, {
                  quality: 0.95,
                  height: sizes[socialMedia].height,
                  width: sizes[socialMedia].width,
                })
                .then((image) => {
                  // download image
                  let link = document.createElement("a");
                  link.download = `${socialMedia}.jpg`;
                  link.href = image;
                  link.click();
                });
            }
          }}
        >
          Download image
        </button>
      </div>

      <div style={{ width: "100%", height: "100%", overflowX: "hidden" }}>
        <div style={{ transform: "scale(0.3)" }}>
          <Frame
            size={{
              width: sizes[socialMedia].width,
              height: sizes[socialMedia].height,
            }}
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
    </div>
  );
}

const Frame = ({
  hidden,
  text,
  size,
  image,
  reference,
}: {
  hidden?: boolean;
  text: string;
  size: {
    height: number;
    width: number;
  };
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
          backgroundColor: "#333",
          width: size.width,
          height: size.height,
          padding: "4rem",

          display: "grid",

          position: "relative",
          overvlow: "hidden",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "6rem",
            lineHeight: ".9",
            textAlign: "left",

            maxWidth: "90%",
            zIndex: "1",
            wordBreak: "break-all",
          }}
        >
          {text}
        </h2>

        <img
          style={{
            alignSelf: "end",
            justifySelf: "end",
            position: "absolute",
            bottom: "4rem",
            right: "4rem",
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
