import { Link } from "react-router-dom";
import Button from "../patterns/button";
import Header from "../patterns/header";

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />

      <div className="container flex flex--column flex--spacing-bottom-medium">
        <h1>404 :(</h1>

        <p>The page you were looking for was not found. </p>

        <Link to="/finder">
          <Button buttonText={"Back to home"} />
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
