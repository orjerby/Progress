import React from 'react'
import { connect } from 'react-redux'
import Menu from './menu/Menu';
import ProjectItem from './menu/ProjectItem';
import Item from './menu/Item';
import { Container } from 'react-bootstrap'
import { FaSave, FaStar, FaTableTennis } from "react-icons/fa";
import history from '../history'
import { Route, Switch } from 'react-router-dom'
import Backlog from './Backlog';
import { logoutUser } from '../actions/user'

class Dashboard extends React.Component {
    render() {
        const { match, user, logoutUser } = this.props

        return (
            <div>
                <Menu>
                    <ProjectItem handleClick={() => history.push(`${match.url}`)} />
                    <Item Icon={<FaSave color='#627f99' />} text='Backlog' handleClick={() => history.push(`${match.url}/backlog`)} />
                    <Item Icon={<FaStar color='#627f99' />} text='sprints' />
                    <Item Icon={<FaTableTennis color='#627f99' />} text='Reports' />
                    <Item Icon={<FaSave color='#627f99' />} text='Logout' handleClick={() => logoutUser(user.token)} />
                </Menu>

                <div className='app-container'>
                    <Container fluid>
                        <Switch>
                            <Route path={`${match.url}`} exact component={props => <h1>Home</h1>} />
                            <Route path={`${match.url}/backlog`} exact component={Backlog} />
                            {/* <Route path={`${match.url}/:projectId`} exact component={props => <h1>{props.match.params.projectId}</h1>} /> */}
                            <Route component={props => <h1>Page not found</h1>} />
                        </Switch>
                    </Container>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ userReducer }) {
    return {
        user: userReducer
    }
}

export default connect(mapStateToProps, { logoutUser })(Dashboard)