import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#5d8d8d] text-white pt-20 pb-10 border-t border-white/20">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Top Section: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Column 1: Brand / Logo */}
                    <div>
                        {/* Logo Container */}
                        <Link to="/" className="flex items-center -ml-20 -mt-20">
                            <img
                                src="/logo2.png"
                                alt="WellWalled Habitat"
                                className="h-[240px] w-auto object-contain brightness-0 invert"
                            />
                        </Link>

                        {/* 👇 SPACING UPDATE: 
                           Changed from -mt-16 to -mt-6.
                           This pushes the text DOWN, creating a gap between the logo and the text.
                        */}
                        <p className="text-white/80 text-sm leading-relaxed max-w-xs font-light -mt-6 pl-1">
                            Crafting timeless spaces that honor the past while embracing the present.
                            Architectural design and interior renovation.
                        </p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-4 text-sm font-light tracking-wide">
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
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 mb-6">
                            Contact
                        </h3>
                        <div className="space-y-4 text-sm font-light tracking-wide text-white/80">
                            <p>123 Design Avenue, New York, NY</p>
                            <p>hello@wellwalled.com</p>
                            <p>+1 (555) 000-0000</p>

                            {/* Social Links */}
                            <div className="flex gap-6 pt-4">
                                <a href="https://www.instagram.com/wellwalledhabitat/?igsh=MXE1ZjE3OXZzbHBmOQ%3D%3D#" className="uppercase text-xs tracking-widest text-white/80 hover:text-white hover:underline transition-colors">Instagram</a>
                                <a href="#" className="uppercase text-xs tracking-widest text-white/80 hover:text-white hover:underline transition-colors">Pinterest</a>
                                <a href="#" className="uppercase text-xs tracking-widest text-white/80 hover:text-white hover:underline transition-colors">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 mb-8"></div>

                {/* Bottom Section: Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/70 uppercase tracking-widest">
                    <p>&copy; {currentYear} Wellwalled Habitat. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-8">
                        <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;