import React from 'react'
import DashboardLayout from './layout';

const Dashboard = () => {
    return <DashboardLayout menuItems={[{label: 'Account Information', href: '/dashboard/account-information'}]}>
        <h1>Dashboard</h1>
    </DashboardLayout>
}

export default Dashboard