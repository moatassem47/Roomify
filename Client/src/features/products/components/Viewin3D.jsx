import "@google/model-viewer";

const Viewin3D = ({model}) => {
  const cleanModelUrl = model ? model.replace("/q_auto/f_auto/", "/") : "";

  return (
     <model-viewer
      src={cleanModelUrl}
      alt="A 3D model"
      auto-rotate
      camera-controls
      ar 
      shadow-intensity="1"
      style={{ width: "100%", height: "400px" }}
    ></model-viewer>
  )
}

export default Viewin3D