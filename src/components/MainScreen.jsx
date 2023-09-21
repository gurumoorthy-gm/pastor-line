import "../styles/MainScreen.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
function MainScreen() {
  const Navigate = useNavigate();
  return (
    <>
      <div className="main-screen">
        <div className="a-block">
          <Button
            className="button-a"
            onClick={() => Navigate("/modal/buttonA")}
          >
            Button A
          </Button>
        </div>
        <div className="b-block">
          <Button
            className="button-b"
            onClick={() => Navigate("/modal/buttonB")}
          >
            Button B
          </Button>
        </div>
      </div>
    </>
  );
}

export default MainScreen;
