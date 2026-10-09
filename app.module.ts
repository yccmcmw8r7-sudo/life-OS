import {Module} from '@nestjs/common';
import {LifeMapController} from './life-map/life-map.controller.js'; import {LifeMapService} from './life-map/life-map.service.js';
import {SafetyController} from './safety/safety.controller.js'; import {SafetyService} from './safety/safety.service.js';
import {AIController} from './ai/ai.controller.js'; import {AIGateway} from './ai/ai.gateway.js';
import {PrismaService} from './common/prisma.service.js'; import {AuthController} from './auth/auth.controller.js'; import {AuthService} from './auth/auth.service.js';
import {GoalsController} from './goals/goals.controller.js'; import {ActionsController} from './actions/actions.controller.js'; import {CheckinsController} from './checkins/checkins.controller.js';
import {TodayController} from './today/today.controller.js'; import {TodayService} from './today/today.service.js';
import {InsightsController,WeeklyReviewController} from './insights/insights.controller.js'; import {InsightsService} from './insights/insights.service.js';
import {MemoriesController} from './memories/memories.controller.js';
import {AccountController} from './account/account.controller.js';
import {HealthController} from './health/health.controller.js';
@Module({controllers:[HealthController,LifeMapController,SafetyController,AIController,MemoriesController,AccountController,AuthController,GoalsController,ActionsController,CheckinsController,TodayController,InsightsController,WeeklyReviewController],providers:[LifeMapService,SafetyService,AIGateway,PrismaService,AuthService,TodayService,InsightsService]}) export class AppModule{}
