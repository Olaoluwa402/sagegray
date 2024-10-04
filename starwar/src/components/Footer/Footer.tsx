const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 ml-64">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Star Wars App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
