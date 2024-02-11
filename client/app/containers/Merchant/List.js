/*
 *
 * List
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';
import { ROLES } from '../../constants';

import SubPage from '../../components/Manager/SubPage';
import MerchantList from '../../components/Manager/MerchantList';
import MerchantSearch from '../../components/Manager/MerchantSearch';
import SearchResultMeta from '../../components/Manager/SearchResultMeta';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';
import Pagination from '../../components/Common/Pagination';
import Chart from 'react-apexcharts';
import { FETCH_MERCHANTS } from './constants';

class List extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      data: '',
      label: ''
    };
  }

  handleFetchdData = async () => {
    const response = await this.props.fetchMerchants();
    console.log('data', response);
    let labelArray = [];
    let dataArray = [];
    response.map(item => {
      item.products.map(pItem => {
        if (labelArray.includes(pItem.product.sku)) {
          let index = labelArray.findIndex(x => x == pItem.product.sku);
          let newValue = dataArray[index] + pItem.quantity;
          dataArray[index] = newValue;
        } else {
          labelArray.push(pItem.product.sku);
          dataArray.push(pItem.quantity);
        }
      });
    });
    console.log(labelArray, dataArray);
    this.setState({
      data: dataArray,
      label: labelArray
    });
  };

  componentDidMount() {
    this.handleFetchdData();
  }

  handleMerchantSearch = e => {
    if (e.value.length >= 2) {
      this.props.searchMerchants({ name: 'merchant', value: e.value });
      this.setState({
        search: e.value
      });
    } else {
      this.setState({
        search: ''
      });
    }
  };

  handleOnPagination = (n, v) => {
    this.props.fetchUsers(v);
  };

  render() {
    const {
      history,
      user,
      merchants,
      isLoading,
      searchedMerchants,
      advancedFilters,
      fetchMerchants,
      approveMerchant,
      rejectMerchant,
      deleteMerchant,
      disableMerchant,
      searchMerchants
    } = this.props;

    const { search } = this.state;
    const isSearch = search.length > 0;
    const filteredMerchants = search ? searchedMerchants : merchants;
    const displayPagination = advancedFilters.totalPages > 1;
    const displayMerchants = filteredMerchants && filteredMerchants.length > 0;

    const options = {
      chart: {
        type: 'bar',
        stacked: false,
        toolbar: {
          show: true
        }
      },

      xaxis: {
        labels: {
          trim: true
        },
        categories: this.state.label
      }
    };

    console.log(this.state.data);
    const series = [
      {
        name: 'sales',
        data: this.state.data
      }
    ];

    return (
      <div className='merchant-dashboard'>
        <SubPage title={'Stats'} />
        {isLoading && <LoadingIndicator />}
        {this.state.data && (
          <Chart type='bar' series={series} options={options} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    merchants: state.merchant.merchants,
    advancedFilters: state.merchant.advancedFilters,
    isLoading: state.merchant.isLoading,
    searchedMerchants: state.merchant.searchedMerchants,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(List);
