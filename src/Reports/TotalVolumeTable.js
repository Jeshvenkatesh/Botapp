import React from 'react';
import classes from "./TotalVolumeTable.module.css";
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css';

const VolumeTable=(props)=>{
           
    const getData=props.getVolumeData;
    let totalQuantity = 0;
    const generateData=getData.map((item,pos)=>{
           if(item.side==="ORDER_SIDE_BUY"){
            totalQuantity = totalQuantity + parseInt(item.quantity)
               return item.quantity
           }
    })
   
    let sellTotalQuantity = 0;
    const sellgenerateData=getData.map((item,pos)=>{
        if(item.side==="ORDER_SIDE_SELL"){
            sellTotalQuantity = sellTotalQuantity + parseInt(item.quantity)
            return item.quantity
        }
 })
 
  let buyTotalfilled = 0;
  const buyTotalfilledData=getData.map((item,pos)=>{
        if(item.side==="ORDER_SIDE_BUY"){
            buyTotalfilled = buyTotalfilled + parseInt(item.filled)
            return item.filled
        }
 })

 let sellTotalfilled=0;
const sellTotalfilledData=getData.map((item,pos)=>{
    if(item.side==="ORDER_SIDE_SELL"){
        sellTotalfilled = sellTotalfilled + parseInt(item.filled)
        return item.filled
    }
})

    const data = [
        {
            Operation: 'ORDER_SIDE_BUY',
            OrderQuantity: totalQuantity,
            FillQuantity: buyTotalfilled
        },
        {
            Operation: 'ORDER_SIDE_SELL',
            OrderQuantity: sellTotalQuantity,
            FillQuantity: sellTotalfilled
        }
    ];

    const columns = [

            {
                Header: "Operation",
                accessor: "Operation",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,

            },
            {
                Header: "Total Quantity",
                accessor: "OrderQuantity",
                sortable: true,
                right: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Total Fill Quantity",
                accessor: "FillQuantity",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            }
        ];
    return(
        <div className={classes.reactTableWrapper}> 
        <ReactTable data={data} columns={columns} defaultPageSize={5}
  minRows={3}/>
        </div>
    )
}
export default VolumeTable;