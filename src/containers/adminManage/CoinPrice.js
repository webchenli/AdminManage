/** 素材
 * */
import React from 'react';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import _ from  'lodash';
import Util from '../../common/utils';
import {Button,Modal} from 'react-bootstrap';
import adminManageStore from '../../stores/adminManage/adminManageStore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ModalView from '../../components/adminManage/material/ModalView';
import Menu from '@/containers/adminManage/Menu';
const store = new adminManageStore();
@observer
export default class CoinPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowsName: [{code:'id',name:'id',hidden:true},{code:'price',name:'价格',add:true },{code:'number',name:'套餐数量',add:true },{code:'remarks',name:'备注',add:true },
               {code:'isDeleted',name:'删除状态'},{code:'gmtCreate',name:'创建时间',type:"date"},{code:'gmtModified',name:'修改时间',type:"date"}, {code:'sortNo',name:'排序',add:true },
            ],
            dataList:[],
            show:false ,
            operationData:{},
            item:1,
            operationType:'preview'   ,  // preview 预览  edit 编辑  add 新增

        }
    }

    componentWillMount(){
        this.getDataList();
    }

    getDataList=()=>{

        store.getCoinPriceList({},(data)=>{
            this.setState({
                dataList:data
            })
        })


    }

    dataFormat = (type,rows,cell)=>{
        if(type=="type"){
            let name ="首页轮播";
            if(type == 2 ){
                name ="首页效果图"
            }else if(type ==3 ){
                name = "提现规则"
            }
            return (
                <span>{name}</span>
            )
        }else{
            return (
                <span>{rows}</span>
            )
        }

    }

    addRows =()=>{
        this.setState({
            show:true,
            operationType:'add',
            data:{}
        })

    }
    previewRows = (rows)=>{
        this.setState({
            show:true ,
            operationData:rows,
            operationType:'preview'
        })

    }
    editRows = (rows)=>{
        this.setState({
            show:true ,
            operationData:rows,
            operationType:'edit'
        })
    }
    deleteRows =(rows)=>{
        globalStore.showTipsModal("是否删除","small",()=>{},()=>{
            store.deleteCoinPrice(rows,()=>{
                this.getDataList()
            });
        })

    }
    closeModal = ()=>{
        this.setState({
            show:false
        })
    }



    saveModal = (data)=>{
        if(this.state.operationType =="add"){
            store.saveCoinPriceList(data,()=>{
                this.closeModal();
                this.getDataList();
            })
        }else{
            store.updateCoinPrice(data,()=>{
                this.closeModal();
                this.getDataList();
            })
        }


    }
    render(){
        const  options ={
            noDataText:"暂无数据"
        }
        return(
            <div className="a-box">
                <Menu />
                <h3>能源币价格</h3>

                <div className="fr mb10">
                    <Button bsStyle="info" onClick={this.addRows}>新增</Button>
                </div>

                <BootstrapTable data={store.CoinPrice} striped hover options={options}>
                    <TableHeaderColumn isKey dataField='id' hidden>Product ID</TableHeaderColumn>
                    {this.state.rowsName.map((m,n)=>{
                        if(!m.hidden ){
                            return (
                                <TableHeaderColumn dataField={m.code} dataFormat={this.dataFormat.bind(this,m.code)}>{m.name}</TableHeaderColumn>
                            )
                        }
                    })}

                    <TableHeaderColumn dataFormat = {
                        (cell,row)=>{
                            return(
                                <div>
                                    <span className="mr5" onClick={this.previewRows.bind(this,row)}>查看</span>
                                    <span className="mr5" onClick={this.editRows.bind(this,row)}>编辑</span>
                                    <span onClick={this.deleteRows.bind(this,row)}>删除</span>
                                </div>
                            )
                        }
                    }>操作</TableHeaderColumn>
                </BootstrapTable>

                <ModalView show= {this.state.show} saveModal = {this.saveModal} closeModal={this.closeModal} rowsName ={this.state.rowsName} data={this.state.operationData} type={this.state.operationType}/>

            </div>
        )
    }
}