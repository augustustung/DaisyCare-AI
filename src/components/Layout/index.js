
import React from 'react'
import { connect } from "react-redux"
import { Layout } from 'antd';
import './layout.scss'
import Footer from "./../Widgets/footer"
import Header from "./../Widgets/header"

function LayoutPage(props) {
  const { Component } = props

  return (
  <Layout>
    {props.isShowHeader && 
      <Header {...props} />    
    }
    <div className="container conent mb-5">
    <Component {...props} />
    </div>
    {/* <Footer/> */}
  </Layout>
  );

}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage)
