
import React from 'react';
import styles from "./AdminCustomers.scss"
import AdaptGrid from '@webstack/components/Containers/AdaptGrid/AdaptGrid';
import { NaCell } from '@webstack/components/AdapTable/components/AdaptTableContent/components/AdaptTableCell/AdaptTableCell';
// import AdminCustomersList from '../views/AdminCustomersList/controller/AdminCustomersList';

// Remember to create a sibling SCSS file with the same name as this component
const data:any = [
  { count: 10, date: '2023-01-01' },
  { count: 20, date: '2023-01-02' },
  { count: 5, date: '2023-01-03' },
  { count: -15, date: '2023-01-04' },
  { count: 8, date: '2023-01-05' },
];
const AdminCustomers = () => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className='admin-mgmt'>
        <div className='admin-mgmt__header'>
        </div>
        <div className='admin-mgmt__body'>
          <AdaptGrid xs={2} md={4} variant='card' gap={10} >
            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>new customers</div>
              <div className='admin-mgmt__card-body'>5</div>
            </div>
            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>products sold</div>
              <div className='admin-mgmt__card-body'>12</div>
            </div>
            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>d</div>
              <div className='admin-mgmt__card-body'>10</div>
            </div>
            <div className='admin-mgmt__card'>
              <div className='admin-mgmt__card-header'>f</div>
              <div className='admin-mgmt__card-body'><NaCell/></div>
            </div>
          </AdaptGrid>
          {/* <AdminCustomersList/> */}
            {/* <UiBarGraph title="customer signup" data={data}/> */}
        </div>
      </div>
    </>
  );
};

export default AdminCustomers;