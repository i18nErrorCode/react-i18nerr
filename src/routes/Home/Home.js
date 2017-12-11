import React from 'react';
import styles from './Home.less';
import MainLayout from '../../components/MainLayout';
import DataTable from '../../components/DataTable';

function Home() {
  return (
    <MainLayout>
      <div className={styles.normal}>
        <DataTable />
      </div>
    </MainLayout>
  );
}

Home.propTypes = {
};

export default Home;
