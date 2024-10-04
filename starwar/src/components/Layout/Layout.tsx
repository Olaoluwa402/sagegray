import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";
import Sidebar from "../Sidebar/Sidebar";

import styles from "./Layout.module.css";
import "react-toastify/dist/ReactToastify.css";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navigation />
      <Sidebar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
