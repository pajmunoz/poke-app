import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import BlobCursor from "./snippets/BlobCursor/BlobCursor";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <BlobCursor
        blobType="circle"
        fillColor="#ff4d4f"
        trailCount={3}
        sizes={[20, 50, 75]}
        innerSizes={[2, 3, 2]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        shadowColor="rgba(0,0,0,0.75)"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        filterStdDeviation={30}
        useFilter={true}
        fastDuration={1.4}
        slowDuration={0.5}
        zIndex={10000}
      />
    </BrowserRouter>
  );
}

export default App;
