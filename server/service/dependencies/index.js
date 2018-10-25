import UpdateAllService from './dependencies.updateAll.service.js';
import ReinstallService from './dependencies.reinstall.service.js';
import ShrinkwrapService from './dependencies.shrinkwrap.service.js';
import DedupeService from './dependencies.dedupe.service.js';
import PruneService from './dependencies.prune.service.js';
import DependenciesService from './dependencies.service.js';

export default {
  get: DependenciesService.get,
  reinstallAllDependencies: ReinstallService.reinstallAllDependencies,
  dedupe: DedupeService.dedupe,
  shrinkwrap: ShrinkwrapService.shrinkwrap,
  prune: PruneService.prune,
  updateAllDependencies: UpdateAllService.updateAllDependencies,
};
