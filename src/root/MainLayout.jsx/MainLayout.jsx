import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MainLayout = () => {
    return (
        <div className=''>
            <header className=''>
                <Navbar/>
            </header>
            <main className='min-h-screen md:min-h-[calc(100vh-397px)]  mt-14 max-w-[1500px] mx-auto px-2 py-6'>
                <Outlet/>
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
};

export default MainLayout;