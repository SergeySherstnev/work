import Vue from 'vue';
import Component from 'vue-class-component';
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
]);
import Router from 'vue-router';
const Home = () => import('../core/home/home.vue');

const BrowseProposal = () => import('../proposal/browse.vue');
const ViewProposal = () => import('../proposal/view.vue');
const EditProposal = () => import('../proposal/edit.vue');

const Error = () => import('../core/error/error.vue');
const Register = () => import('../account/register/register.vue');
const Activate = () => import('../account/activate/activate.vue');
const ResetPasswordInit = () => import('../account/reset-password/init/reset-password-init.vue');
const ResetPasswordFinish = () => import('../account/reset-password/finish/reset-password-finish.vue');
const ChangePassword = () => import('../account/change-password/change-password.vue');
const Settings = () => import('../account/settings/settings.vue');
const JhiUserManagementComponent = () => import('../admin/user-management/user-management.vue');
const JhiUserManagementViewComponent = () => import('../admin/user-management/user-management-view.vue');
const JhiUserManagementEditComponent = () => import('../admin/user-management/user-management-edit.vue');
const JhiConfigurationComponent = () => import('../admin/configuration/configuration.vue');
const JhiDocsComponent = () => import('../admin/docs/docs.vue');
const JhiHealthComponent = () => import('../admin/health/health.vue');
const JhiLogsComponent = () => import('../admin/logs/logs.vue');
const JhiAuditsComponent = () => import('../admin/audits/audits.vue');
const JhiMetricsComponent = () => import('../admin/metrics/metrics.vue');
const JhiTrackerComponent = () => import('../admin/tracker/tracker.vue');
/* tslint:disable */
// prettier-ignore
const ProposalProp = () => import('../entities/proposal-prop/proposal-prop.vue');
// prettier-ignore
const ProposalPropUpdate = () => import('../entities/proposal-prop/proposal-prop-update.vue');
// prettier-ignore
const ProposalPropDetails = () => import('../entities/proposal-prop/proposal-prop-details.vue');
// prettier-ignore
const HistoryProp = () => import('../entities/history-prop/history-prop.vue');
// prettier-ignore
const HistoryPropUpdate = () => import('../entities/history-prop/history-prop-update.vue');
// prettier-ignore
const HistoryPropDetails = () => import('../entities/history-prop/history-prop-details.vue');
// prettier-ignore
const TagProp = () => import('../entities/tag-prop/tag-prop.vue');
// prettier-ignore
const TagPropUpdate = () => import('../entities/tag-prop/tag-prop-update.vue');
// prettier-ignore
const TagPropDetails = () => import('../entities/tag-prop/tag-prop-details.vue');
// prettier-ignore
const CommentProp = () => import('../entities/comment-prop/comment-prop.vue');
// prettier-ignore
const CommentPropUpdate = () => import('../entities/comment-prop/comment-prop-update.vue');
// prettier-ignore
const CommentPropDetails = () => import('../entities/comment-prop/comment-prop-details.vue');
// prettier-ignore
const AlikeProp = () => import('../entities/alike-prop/alike-prop.vue');
// prettier-ignore
const AlikePropUpdate = () => import('../entities/alike-prop/alike-prop-update.vue');
// prettier-ignore
const AlikePropDetails = () => import('../entities/alike-prop/alike-prop-details.vue');
// prettier-ignore
const QuotesProp = () => import('../entities/quotes-prop/quotes-prop.vue');
// prettier-ignore
const QuotesPropUpdate = () => import('../entities/quotes-prop/quotes-prop-update.vue');
// prettier-ignore
const QuotesPropDetails = () => import('../entities/quotes-prop/quotes-prop-details.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

Vue.use(Router);

// prettier-ignore
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },



    {
      path: '/proposal/browse',
      name: 'BrowseProposal',
      component: BrowseProposal
    },
    {
      path: '/proposal/:proposalId/view',
      name: 'ViewProposal',
      component: ViewProposal
    },
    {
      path: '/proposal/:proposalId/edit',
      name: 'EditProposal',
      component: EditProposal,
      meta: { authorities: ['ROLE_USER'] }
    },
    {
      path: '/proposal/new',
      name: 'NewProposal',
      component: EditProposal,
      meta: { authorities: ['ROLE_USER'] }
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: Error,
      meta: { error403: true }
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: Error,
      meta: { error404: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/activate',
      name: 'Activate',
      component: Activate
    },
    {
      path: '/reset/request',
      name: 'ResetPasswordInit',
      component: ResetPasswordInit
    },
    {
      path: '/reset/finish',
      name: 'ResetPasswordFinish',
      component: ResetPasswordFinish
    },
    {
      path: '/account/password',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: { authorities: ['ROLE_USER'] }
    },
    {
      path: '/account/settings',
      name: 'Settings',
      component: Settings,
      meta: { authorities: ['ROLE_USER'] }
    },
    {
      path: '/admin/user-management',
      name: 'JhiUser',
      component: JhiUserManagementComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/user-management/new',
      name: 'JhiUserCreate',
      component: JhiUserManagementEditComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/user-management/:userId/edit',
      name: 'JhiUserEdit',
      component: JhiUserManagementEditComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/user-management/:userId/view',
      name: 'JhiUserView',
      component: JhiUserManagementViewComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/docs',
      name: 'JhiDocsComponent',
      component: JhiDocsComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/audits',
      name: 'JhiAuditsComponent',
      component: JhiAuditsComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/jhi-health',
      name: 'JhiHealthComponent',
      component: JhiHealthComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/logs',
      name: 'JhiLogsComponent',
      component: JhiLogsComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/jhi-metrics',
      name: 'JhiMetricsComponent',
      component: JhiMetricsComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/jhi-configuration',
      name: 'JhiConfigurationComponent',
      component: JhiConfigurationComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/admin/jhi-tracker',
      name: 'JhiTrackerComponent',
      component: JhiTrackerComponent,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/proposal-prop',
      name: 'ProposalProp',
      component: ProposalProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/proposal-prop/new',
      name: 'ProposalPropCreate',
      component: ProposalPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/proposal-prop/:proposalId/edit',
      name: 'ProposalPropEdit',
      component: ProposalPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/proposal-prop/:proposalId/view',
      name: 'ProposalPropView',
      component: ProposalPropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/history-prop',
      name: 'HistoryProp',
      component: HistoryProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/history-prop/new',
      name: 'HistoryPropCreate',
      component: HistoryPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/history-prop/:historyId/edit',
      name: 'HistoryPropEdit',
      component: HistoryPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/history-prop/:historyId/view',
      name: 'HistoryPropView',
      component: HistoryPropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/tag-prop',
      name: 'TagProp',
      component: TagProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/tag-prop/new',
      name: 'TagPropCreate',
      component: TagPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/tag-prop/:tagId/edit',
      name: 'TagPropEdit',
      component: TagPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/tag-prop/:tagId/view',
      name: 'TagPropView',
      component: TagPropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/comment-prop',
      name: 'CommentProp',
      component: CommentProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/comment-prop/new',
      name: 'CommentPropCreate',
      component: CommentPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/comment-prop/:commentId/edit',
      name: 'CommentPropEdit',
      component: CommentPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/comment-prop/:commentId/view',
      name: 'CommentPropView',
      component: CommentPropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/alike-prop',
      name: 'AlikeProp',
      component: AlikeProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/alike-prop/new',
      name: 'AlikePropCreate',
      component: AlikePropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/alike-prop/:alikeId/edit',
      name: 'AlikePropEdit',
      component: AlikePropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/alike-prop/:alikeId/view',
      name: 'AlikePropView',
      component: AlikePropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/quotes-prop',
      name: 'QuotesProp',
      component: QuotesProp,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/quotes-prop/new',
      name: 'QuotesPropCreate',
      component: QuotesPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/quotes-prop/:quotesId/edit',
      name: 'QuotesPropEdit',
      component: QuotesPropUpdate,
      meta: { authorities: ['ROLE_ADMIN'] }
    },
    {
      path: '/entity/quotes-prop/:quotesId/view',
      name: 'QuotesPropView',
      component: QuotesPropDetails,
      meta: { authorities: ['ROLE_ADMIN'] }
    }
    // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
  ]
});
