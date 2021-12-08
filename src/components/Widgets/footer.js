import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import './footer.scss'

const { Footer: FooterAntd } = Layout;

export default function Footer(props) {
  const history = props.history


  return (
    <FooterAntd>
      <div className="footer">
        <div className='row w-100 mt-2'>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className='row'>
              <div className="w-auto">
              </div>
              <div className="col-6 pt-1">
                <span className="footer_slogan">
                  asdasdasdasdsadasdasd
                </span>
              </div>
            </div>
            <div className="footer_subTitle">dsadasdasadsdsasdd</div>
          </div>
          {/*  */}
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div className="footer_section">Liên kết nhanh</div>
            <ul className="footer_section_content">
              <li onClick={() => history.push("/")}><p>Trang chủ</p></li>
              <li onClick={() => history.push("/booking-schedule")}><p>Đặt lịch</p></li>
              <li onClick={() => history.push("/new-public")}><p>Tin tức</p></li>
              <li onClick={() => history.push('/')}><p>Liên hệ</p></li>
            </ul>

          </div>
          {/*  */}
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <div className="text-center mb-2 footer_section">Liên kết ngoài</div>
            <div className="d-flex justify-content-center">
              <a 
                href={"#"} 
                target="_blank"
              ><span className="iconify footer_icon" data-icon="brandico:facebook-rect"></span></a>
              <a 
                href={"#"} 
                target="_blank"
              ><span className="iconify footer_icon" data-icon="bi:instagram"></span></a>
              <a 
                href={"#"} 
                target="_blank"
              ><span className="iconify footer_icon" data-icon="akar-icons:twitter-fill"></span></a>
              <a 
                href={"#"} 
                target="_blank"
              ><span className="iconify footer_icon" data-icon="akar-icons:youtube-fill"></span></a>
            </div>
          </div>
        </div>
      </div>
    </FooterAntd>
  );
}
