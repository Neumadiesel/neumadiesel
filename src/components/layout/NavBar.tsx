import React from 'react';
const NavBar: React.FC = () => {
    return (
        <div className="flex justify-between items-center h-16 bg-[#212121] text-white relative shadow-sm font-mono">
            <div className="pl-8">Neumadiesel</div>
            <div className="pr-8">About</div>
            <div className="pr-8">Home</div>
        </div>
    );
};

export default NavBar;