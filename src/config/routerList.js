// 该文件配置所有路由组件
import NewsAdd from '../pages/news-manage/NewsAdd'
import NewsDraft from '../pages/news-manage/NewsDraft'
import NewsCategory from '../pages/news-manage/NewsCategory'
import Audit from '../pages/aduit-manage/Audit'
import AuditList from '../pages/aduit-manage/AuditList'
import Unpublished from '../pages/publish-manage/Unpublished'
import Published from '../pages/publish-manage/Published'
import Sunset from '../pages/publish-manage/Sunset'
import Home from '../pages/home/Home'
import User from '../pages/user/User'
import Role from '../pages/right-manage/RoleList'
import RightList from '../pages/right-manage/RightList'
import NewsPreview from '../pages/news-manage/NewsPreview'
import NewsUpdate from '../pages/news-manage/NewsUpdate'



const routerList= {
    "/home": Home,
    "/user-manage/list": User,
    "/right-manage/role/list": Role,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset
}

export default routerList