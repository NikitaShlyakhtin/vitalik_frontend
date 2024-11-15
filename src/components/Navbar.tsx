import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Tabs, Container} from '@mantine/core';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string | null>(location.pathname);

    const handleTabChange = (value: string | null) => {
        setActiveTab(value);
        navigate(`${value}`)
    };

    return (
        <Container size="md" mt="md" px="0">
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
            >
                <Tabs.List>
                    <Tabs.Tab value="/" >
                        Profile
                    </Tabs.Tab>
                    <Tabs.Tab value="/wallets" >
                        Wallets
                    </Tabs.Tab>
                    <Tabs.Tab value="/deposit"  >
                        Deposit
                    </Tabs.Tab>
                    <Tabs.Tab value="/order" >
                        New Order
                    </Tabs.Tab>
                    <Tabs.Tab value="/orders" >
                        Order Book
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </Container>
    );
};

export default Navbar;
