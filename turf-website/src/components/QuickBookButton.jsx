import { Link } from "react-router-dom";
import "../styles/QuickBookButton.css";

function QuickBookButton() {
  return (
    <Link to="/booking" className="quick-book-btn">
      <span className="material-symbols-outlined">add</span>
      <span className="quick-book-tooltip">QUICK BOOK</span>
    </Link>
  );
}

export default QuickBookButton;