function skillsMember() {
  return {
    name: 'skillsMember',
    restrict: 'E',
    templateUrl: 'app/members/skills/skills.html',
    controller: 'SkillsMemberCtrl',
    controllerAs: 'skillsMember',
    bindToController: true
  };
}