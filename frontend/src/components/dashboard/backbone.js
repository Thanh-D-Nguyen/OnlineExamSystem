import React from "react";
import "./backbone.css";
import { connect } from "react-redux";
import AllTrainer from "../admin/allTrainer/alltrainer";
import AllTopics from "../admin/allTopics/alltopics.js";
import AllQuestions from "../trainer/allquestions/allquestion";
import AllTests from "../trainer/alltests/alltest";
import ConductTest from "../trainer/conducttest/conducttest";
import NewTest from "../trainer/newtest/newtest";
import auth from "../../services/AuthServices";
import Welcome from "./welcome";
import ErrorPage from "./errorPage";
import { login, logout } from "../../actions/loginAction";
import { changeActiveRoute } from "../../actions/useraction.js";
import Alert from "../common/alert";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { Layout, Menu, Button, Tooltip } from "antd";
import { LogoutOutlined, MediumOutlined } from "@ant-design/icons";
import main from "./main.jpg";
const { Header, Sider, Content } = Layout;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LocalIsLoggedIn: this.props.user.isLoggedIn,
      collapsed: true,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logOut = () => {
    auth.deleteToken();
    window.location.href = "/";
  };

  componentDidMount() {
    var t = auth.retrieveToken();
    if (!this.state.LocalIsLoggedIn && t && t !== "undefined") {
      auth
        .FetchAuth(t)
        .then((response) => {
          this.props.login(response.data.user);
          this.setState({ LocalIsLoggedIn: true });
          const subUrl = this.props.match.params.options;
          const obj = this.props.user.userOptions.find(
            (o) => o.link === `/user/${subUrl}`
          );
          const tt = this.props.user.userOptions.indexOf(obj);
          if (tt === -1) {
            window.location.href = this.props.user.userOptions[0].link;
          } else {
            this.props.changeActiveRoute(String(tt));
          }
        })
        .catch((error) => {
          Alert("warning", "Warning!", "Server Error.");
          auth.deleteToken();
          window.location.href = "/";
        });
    }
    
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.updateContentBasedOnRoute();
    }
  }

  updateContentBasedOnRoute() {
    const { pathname } = this.props.location;
    const match = pathname.match(/\/user\/(.+)/);
    const subUrl = match ? match[1] : 'home';

    const optionIndex = this.props.user.userOptions.findIndex(option => option.link === `/user/${subUrl}`);
    if (optionIndex >= 0) {
      this.props.changeActiveRoute(optionIndex);
    }
  }

  render() {
    let torender;
    const activeOption = this.props.user.userOptions[this.props.user.activeRoute];
    // const option = "listtrainers";
    const linkPath = activeOption && activeOption.link
        ? activeOption.link.split('/').pop()
        : null;
    console.log("Current option:", this.props);
    switch (linkPath) {
      case "listtrainers":
        torender = <AllTrainer />;
        break;
      case "listsubjects":
        torender = <AllTopics />;
        break;
      case "listquestions":
        torender = <AllQuestions />;
        break;
      case "listtests":
        torender = <AllTests />;
        break;
      case "home":
        torender = <Welcome />;
        break;
      case "newtest":
        torender = <NewTest />;
        break;
      case "conducttest":
        console.log(this.props);
        const params = queryString.parse(this.props.location.search);
        torender = <ConductTest {...params} />;
        break;
      default:
        torender = <ErrorPage />;
        break;
    }

    // Tạo menu items
    const menuItems = this.props.user.userOptions.map((d, i) => ({
      key: String(i),
      icon: <MediumOutlined />,
      label: (
        <span>
          {d.display}
          <Link to={d.link} onClick={() => this.props.changeActiveRoute(i)}/>
        </span>
      ),
    }));

    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
            zIndex: 5,
          }}
        >
          <div className="logo11" />
          <Menu
            defaultSelectedKeys={[this.props.user.activeRoute]}
            mode="inline"
            theme="dark"
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header
            theme="dark"
            style={{
              position: "fixed",
              width: "100vw",
              paddingLeft: "10px",
              zIndex: "1000",
            }}
          >
            <MediumOutlined
              className="trigger"
              onClick={this.toggle}
              style={{ color: "#fff", fontSize: "20px" }}
            />
            <ul className="user-options-list">
              <li>
                <Tooltip placement="bottom" title="Log Out">
                  <Button
                    type="primary"
                    size="large"
                    shape="circle"
                    onClick={this.logOut}
                    className="logout-button"
                  >
                    <LogoutOutlined />
                  </Button>
                </Tooltip>
              </li>
              <li>
                <img src={main} alt="company logo" className="d-logo" />
              </li>
            </ul>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              marginTop: "80px",
              background: "rgb(205,217,225)",
              minHeight: "100vh",
              marginLeft: "200px",
            }}
          >
            {torender}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  changeActiveRoute,
  login,
  logout,
})(Dashboard);
