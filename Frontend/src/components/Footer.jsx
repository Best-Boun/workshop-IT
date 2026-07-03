import "./Footer.css";

const Footer = () => {
  return (
    <footer id="contact" className="site-footer bg-white py-5 border-top">
      <div className="container">
        <div className="row gy-4 footer-grid">
          <div className="col-md-4 footer-brand-column">
            <h5 className="fw-bold footer-brand mb-3">TechPulse</h5>
            <p className="text-muted footer-brand-copy mb-0">
              Modern hardware shopping for gamers, creators, and power users.
            </p>
          </div>
          <div className="col-md-3 footer-column">
            <h6 className="footer-title fw-semibold">Company</h6>
            <ul className="footer-links list-unstyled text-muted mb-0">
              <li>About Us</li>
              <li>Careers</li>
              <li>Terms</li>
            </ul>
          </div>
          <div className="col-md-3 footer-column">
            <h6 className="footer-title fw-semibold">Contact</h6>
            <div className="footer-contact text-muted">
              <p className="mb-1">support@techpulse.com</p>
              <p className="mb-0">+1 234 567 890</p>
            </div>
          </div>
          <div className="col-md-2 footer-column">
            <h6 className="footer-title fw-semibold">Social</h6>
            <div className="footer-social d-flex flex-column gap-2 text-muted">
              <a href="#" className="footer-social-link text-muted text-decoration-none">
                Twitter
              </a>
              <a href="#" className="footer-social-link text-muted text-decoration-none">
                Instagram
              </a>
              <a href="#" className="footer-social-link text-muted text-decoration-none">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-4 pt-4 border-top text-center text-muted small">
          © 2026 TechPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
