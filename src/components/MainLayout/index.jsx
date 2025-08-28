import { Outlet } from 'react-router-dom';
import TopBar from '../TopBar'; 
import BottomBar from '../BottomBar'; 

const MainLayout = () => {

    return (
        <div className="main-layout-container">
            <TopBar />
            
            <div>
                <Outlet />
            </div>

            <BottomBar />
        </div>
    );
};

export default MainLayout;