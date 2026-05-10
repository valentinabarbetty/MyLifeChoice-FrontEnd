import { Html } from "@react-three/drei";

export default function Loader() {
  return (
    <Html center>
      <div style={styles.container}>
        <p>Cargando mundo...</p>
      </div>
    </Html>
  );
}

const styles = {
  container: {
    padding: "12px 18px",
    background: "rgba(0,0,0,0.7)",
    borderRadius: "10px",
    color: "#fff",
    textAlign: "center",
  },
};