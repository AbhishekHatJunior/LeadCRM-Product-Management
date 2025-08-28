import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import ProfImgIt from "../assets/images/ProfImgIt.jpg";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";


const Dropdown = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    return (
        <div
            className="dropdown-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
        >
            <div className="top-bar-txt">
                {title} &nbsp;<i className="fa-solid fa-caret-down fa-xs"></i>
            </div>
            {isOpen && (
                <div
                    className="dropdown-menu"
                    onMouseLeave={handleMouseLeave}
                >
                    {items.map((item, index) => (
                        <div key={index} className="dropdown-item">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TopBar = () => {
    const topbarItems = [
        {
            title: "Sales",
            items: ["Orders", "Customers", "Quotations", "Invoices"]
        },
        {
            title: "Accounts",
            items: ["Invoices", "Expenses", "Reports", "Taxes"]
        },
        {
            title: "Purchase",
            items: ["Vendors", "Purchase Orders", "Inventory", "Receipts"]
        },
        {
            title: "HR",
            items: ["Employees", "Attendance", "Payroll", "Recruitment"]
        },
        {
            title: "Marketing",
            items: ["Dashboard", "Contacts", "Leads", "Opportunities"]
        },
    ];

    const profileItems = [
        {
            name: "Profile",
            icon: <FaUser />
        },
        {
            name: "Settings",
            icon: <IoMdSettings />
        },
        {
            name: "Logout",
            icon: <MdOutlineLogout size={15} />
        },
    ]

    return (
        <div className="top-bar shadow">
            <div className="top-bar-left gap-1">
                <div className='comp-title-txt'>Intricare Technologies</div>
                <div className='d-none d-lg-block'>
                    {topbarItems.map((item, index) => (
                        <Dropdown key={index} title={item.title} items={item.items} />
                    ))}
                </div>
            </div>
            <div className="user-avatar d-flex dropdown-container">
                <Image className='profImgDimension' src={ProfImgIt} roundedCircle />
                <div className='avatar-txt'>Abhishek Dey</div>

                <div className="dropdown-menu">
                    {profileItems.map((item) => (
                        <div className="dropdown-item">{item.icon} &nbsp; {item.name}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopBar;