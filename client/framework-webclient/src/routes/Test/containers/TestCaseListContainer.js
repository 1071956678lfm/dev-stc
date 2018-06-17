import React, {Component,PropTypes} from 'react';
import {connect} from "react-redux";
import {addTabAction} from "MODULES/ducks/Layout";
import {TestCaseContentView} from "../../Test";
import {deleteTestCase, getTestCaseList, newTestCase} from "../../../services/TestCaseService";
import {setTestCaseFilter} from "../../../modules/ducks/TestCase";
import TestCaseListComponent from "../components/TestCaseListComponent";

const mapStateToProps = (state) => {
    const authData = JSON.parse(sessionStorage.getItem('authData'));
    //console.log(state.Consign.listMap);
    return {
        dataSource: Object.values(state.TestCase.listMap).filter(state.TestCase.listFilter),
        //enableNew: authData.functionGroup["Consign"]!==undefined&&authData.functionGroup["Consign"].findIndex(element => element === "ADD")!==-1
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showContent: (id) => {
            // debugger;
            const key = "测试用例" + id;
            dispatch(addTabAction(key, '测试用例详情', TestCaseContentView, {id: id}));
//            dispatch(setConsignContent())
        },
        setListFilter: (listFilter) => dispatch(setTestCaseFilter(listFilter)),
        getTestCaseList: () => getTestCaseList(dispatch),
        deleteTestCase: (id) => deleteTestCase(dispatch,id),
        //newTestCase: () => newTestCase(dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TestCaseListComponent);