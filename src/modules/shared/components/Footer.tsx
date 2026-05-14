import { FaFacebook, FaInstagram, FaTiktok, FaYoutube , FaLinkedin } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-white text-slate-700 px-10">
      <div className="mx-auto max-w-6xl py-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Brand + Social */}
        <div>
          <h3 className="text-xl font-bold">Milan Pitagaldeniya</h3>
          <p className="mt-2 text-sm text-slate-600">
            Learn. Practice. Achieve.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <a
              aria-label="Facebook"
              href="https://www.facebook.com/milanpitagaldeniyascience"
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-75"
            >
              <FaFacebook size={20} />
            </a>
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/sciencewithmilan/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-75"
            >
              <FaInstagram size={20} />
            </a>
            <a
              aria-label="Youtube"
              href=" https://www.youtube.com/@sciencewithmilan"
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-75"
            >
              <FaYoutube size={20} />
            </a>

            <a
              aria-label="TikTok"
              href="https://www.tiktok.com/@milan_science"
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-75"
            >
              <FaTiktok size={20} />
            </a>

            <a
              aria-label="LinkedIn"
              href="https://linkedin.com/company/science-with-milan"
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-75"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Contact / Support */}
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-slate-800">
            Contact & Support
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="text-slate-500">Call:</span>{" "}
              <a href="tel:+94123456789" className="hover:opacity-75">
                +94 11 123 4567
              </a>
            </li>
            <li>
              <span className="text-slate-500">Email:</span>{" "}
              <a href="mailto:support@ama.academy" className="hover:opacity-75">
                support@ama.academy
              </a>
            </li>
            <li className="text-slate-500">Address: Gampaha, Sri Lanka</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto max-w-6xl py-4 flex flex-col items-center justify-between gap-2 text-xs text-slate-500 md:flex-row">
          <p>&copy; {year} Alpha Media Academy. All rights reserved.</p>
          {/*<div className="flex items-center gap-4">*/}
          {/*  <a href="/privacy" className="hover:opacity-75">*/}
          {/*    Privacy*/}
          {/*  </a>*/}
          {/*  <span>•</span>*/}
          {/*  <a href="/terms" className="hover:opacity-75">*/}
          {/*    Terms*/}
          {/*  </a>*/}
          {/*</div>*/}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
