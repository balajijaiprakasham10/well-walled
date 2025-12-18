import { Link } from "react-router-dom";

const Footer = () => {
    

    return (
        <footer className="bg-[#5d8d8d] text-white pt-20 pb-10 border-t border-white/20">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Top Section: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Column 1: Brand / Logo */}
                    <div className="flex flex-col gap-6">
                        <Link
                            to="/"
                            className="
      font-century
      text-base md:text-2xl lg:text-3xl
      font-semibold
      uppercase text-white
      tracking-widest lg:tracking-[0.2em]
    "
                        >
                            WELLWALLED HABITAT
                        </Link>

                        <p className="text-white/80 text-lg leading-relaxed max-w-xs font-light">
                            Crafting timeless spaces that honor the past while embracing the present.
                            Architectural design and interior renovation.
                        </p>
                    </div>


                    {/* Column 2: Navigation */}
                    <div>
                        {/* UPDATED: Increased to text-lg */}
                        <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white/90 mb-6">
                            Explore
                        </h3>
                        {/* UPDATED: Increased to text-lg */}
                        <ul className="space-y-4 text-lg font-light tracking-wide">
                            <li>
                                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-white/80 hover:text-white transition-colors">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link to="/products/all" className="text-white/80 hover:text-white transition-colors">
                                    Our Work
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact & Social */}
                    <div>
                        {/* UPDATED: Increased to text-lg */}
                        <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white/90 mb-6">
                            Contact
                        </h3>
                        {/* UPDATED: Increased to text-lg */}
                        <div className="space-y-4 text-lg font-light tracking-wide text-white/80">
                            <p>123 Design Avenue, New York, NY</p>
                            <p>hello@wellwalled.com</p>
                            <p>+1 (555) 000-0000</p>

                            {/* Social Links */}
                            {/* UPDATED: Increased to text-base (medium) */}
                            <div className="flex gap-6 pt-4">
                                <a href="https://www.instagram.com/wellwalledhabitat/?igsh=MXE1ZjE3OXZzbHBmOQ%3D%3D#" className="uppercase text-base tracking-widest text-white/80 hover:text-white hover:underline transition-colors">Instagram</a>
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 mb-8"></div>

                {/* Bottom Section: Copyright */}
                {/* UPDATED: Increased to text-base (medium) */}
                <div className="flex flex-col md:flex-row justify-between items-center text-base text-white/70 uppercase tracking-widest">

                </div>
            </div>
        </footer>
    );
};

export default Footer;