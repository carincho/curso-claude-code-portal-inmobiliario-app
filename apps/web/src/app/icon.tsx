import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c2410c",
          borderRadius: 7,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 9.75V20a.75.75 0 0 0 .75.75h3.75v-5.25a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v5.25H18a.75.75 0 0 0 .75-.75V9.75"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
