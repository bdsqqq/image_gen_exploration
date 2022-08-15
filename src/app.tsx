import { lazy, Suspense } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import domtoimage from "dom-to-image-more";
import "./app.css";

import { AcceleratedComputing } from "@carbon/pictograms-react";

import { sizes } from "./data/sizes";
type SizesUnion = keyof typeof sizes;
const sizeKeys = Object.keys(sizes) as unknown as SizesUnion[];

export function App() {
  const [text, setText] = useState("");
  const [selectedSocialMedias, setSelectedSocialMedias] = useState<
    SizesUnion[]
  >([]);

  const [isHidden, setIsHidden] = useState(true);

  // Should probably create only the refs I need BUT since there's just 4 possible social medias for now I'm not opening the whole dynamic ref can of worms.
  const facebookRef = useRef<HTMLDivElement>(null);
  const twitterRef = useRef<HTMLDivElement>(null);
  const instagramRef = useRef<HTMLDivElement>(null);
  const linkedinRef = useRef<HTMLDivElement>(null);
  const refEnum = {
    facebook: facebookRef,
    twitter: twitterRef,
    instagram: instagramRef,
    linkedin: linkedinRef,
  };

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

        <fieldset style={{ display: "flex", flexDirection: "column" }}>
          <legend>Social media targets</legend>
          {sizeKeys.map((socialMedia) => (
            <label
              key={socialMedia}
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                name={socialMedia}
                checked={selectedSocialMedias.includes(socialMedia)}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setSelectedSocialMedias((prev) => [...prev, socialMedia]);
                  }
                  if (!e.currentTarget.checked) {
                    setSelectedSocialMedias((prev) =>
                      prev.filter((s) => s !== socialMedia)
                    );
                  }
                }}
              />
              {socialMedia}
            </label>
          ))}
        </fieldset>

        <button
          onClick={() => {
            const promises = selectedSocialMedias.map((socialMedia) => {
              const ref = refEnum[socialMedia];
              if (!ref.current) return;

              return domtoimage
                .toJpeg(ref.current, {
                  quality: 1,
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
            });

            Promise.all(promises).then(() => {
              console.log("done");
            });
          }}
        >
          Download images
        </button>
      </div>

      <div style={{ width: "100%", height: "100%" }}>
        {selectedSocialMedias.map((socialMedia) => (
          <>
            <h2>{socialMedia}</h2>
            <div style={{}}>
              <Frame
                size={{
                  width: sizes[socialMedia].width,
                  height: sizes[socialMedia].height,
                }}
                hidden={isHidden}
                reference={refEnum[socialMedia]}
                text={text}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

const Frame = ({
  hidden,
  text,
  size,
  pictogram = "Airplane",
  reference,
}: {
  hidden?: boolean;
  text: string;
  size: {
    height: number;
    width: number;
  };
  pictogram?: string;
  reference: preact.RefObject<HTMLDivElement>;
}) => {
  const renderPictogram = (pictogram: string) => {
    let pictogramString = pictogram.replace("<", "").replace(" />", "");
    let Pictogram = lazy(() =>
      import("@carbon/pictograms-react").then(
        (pictograms) => pictograms[pictogramString]
      )
    );
    if (Pictogram) {
      return <Pictogram />;
    }
    return null;
  };

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
        <Suspense fallback={<AcceleratedComputing />}>
          {renderPictogram(pictogram)}
        </Suspense>
      </div>
    </div>
  );
};
