import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Goal = {
    id : Nat;
    name : Text;
    targetDate : Text;
    createdTimestamp : Time.Time;
  };

  type Habit = {
    id : Nat;
    name : Text;
    createdTimestamp : Time.Time;
    completionLogs : List.List<Text>;
  };

  type HabitView = {
    id : Nat;
    name : Text;
    createdTimestamp : Time.Time;
    completionLogs : [Text];
  };

  type UserProfile = {
    dateOfBirth : Text;
    themePreference : Text;
  };

  type UserData = {
    profile : ?UserProfile;
    goals : Map.Map<Nat, Goal>;
    habits : Map.Map<Nat, Habit>;
    nextGoalId : Nat;
    nextHabitId : Nat;
  };

  let users = Map.empty<Principal, UserData>();

  func getUserDataOrTrap(user : Principal) : UserData {
    switch (users.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?userData) { userData };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let userData = switch (users.get(caller)) {
      case (null) { { profile = ?profile; goals = Map.empty<Nat, Goal>(); habits = Map.empty<Nat, Habit>(); nextGoalId = 1; nextHabitId = 1 } };
      case (?u) { { u with profile = ?profile } };
    };

    users.add(caller, userData);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };

    switch (users.get(caller)) {
      case (null) { null };
      case (?userData) { userData.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (users.get(user)) {
      case (null) { null };
      case (?userData) { userData.profile };
    };
  };

  public shared ({ caller }) func createGoal(name : Text, targetDate : Text) : async Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };

    let userData = switch (users.get(caller)) {
      case (null) { { profile = null; goals = Map.empty<Nat, Goal>(); habits = Map.empty<Nat, Habit>(); nextGoalId = 1; nextHabitId = 1 } };
      case (?u) { u };
    };

    let goal : Goal = {
      id = userData.nextGoalId;
      name;
      targetDate;
      createdTimestamp = Time.now();
    };

    userData.goals.add(goal.id, goal);
    users.add(caller, { userData with nextGoalId = userData.nextGoalId + 1 });
    goal;
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get goals");
    };

    switch (users.get(caller)) {
      case (null) { [] };
      case (?userData) { userData.goals.values().toArray() };
    };
  };

  public shared ({ caller }) func updateGoal(goalId : Nat, name : Text, targetDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update goals");
    };

    let userData = getUserDataOrTrap(caller);
    switch (userData.goals.get(goalId)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?goal) {
        let updatedGoal = {
          id = goal.id;
          name;
          targetDate;
          createdTimestamp = goal.createdTimestamp;
        };
        userData.goals.add(goal.id, updatedGoal);
      };
    };
  };

  public shared ({ caller }) func deleteGoal(goalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete goals");
    };

    let userData = getUserDataOrTrap(caller);
    userData.goals.remove(goalId);
  };

  public shared ({ caller }) func createHabit(name : Text) : async HabitView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create habits");
    };

    let userData = switch (users.get(caller)) {
      case (null) { { profile = null; goals = Map.empty<Nat, Goal>(); habits = Map.empty<Nat, Habit>(); nextGoalId = 1; nextHabitId = 1 } };
      case (?u) { u };
    };

    let habit : Habit = {
      id = userData.nextHabitId;
      name;
      createdTimestamp = Time.now();
      completionLogs = List.empty<Text>();
    };

    userData.habits.add(habit.id, habit);
    users.add(caller, { userData with nextHabitId = userData.nextHabitId + 1 });

    {
      id = habit.id;
      name = habit.name;
      createdTimestamp = habit.createdTimestamp;
      completionLogs = [];
    };
  };

  public query ({ caller }) func getHabits() : async [HabitView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get habits");
    };

    switch (users.get(caller)) {
      case (null) { [] };
      case (?userData) {
        userData.habits.values().toArray().map(
          func(habit) {
            {
              id = habit.id;
              name = habit.name;
              createdTimestamp = habit.createdTimestamp;
              completionLogs = habit.completionLogs.toArray();
            };
          }
        );
      };
    };
  };

  public shared ({ caller }) func updateHabit(habitId : Nat, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update habits");
    };

    let userData = getUserDataOrTrap(caller);
    switch (userData.habits.get(habitId)) {
      case (null) { Runtime.trap("Habit not found") };
      case (?habit) {
        let updatedHabit = {
          id = habit.id;
          name;
          createdTimestamp = habit.createdTimestamp;
          completionLogs = habit.completionLogs;
        };
        userData.habits.add(habit.id, updatedHabit);
      };
    };
  };

  public shared ({ caller }) func deleteHabit(habitId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete habits");
    };

    let userData = getUserDataOrTrap(caller);
    userData.habits.remove(habitId);
  };

  public shared ({ caller }) func markHabitComplete(habitId : Nat, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark habits as complete");
    };

    let userData = getUserDataOrTrap(caller);
    switch (userData.habits.get(habitId)) {
      case (null) { Runtime.trap("Habit not found") };
      case (?habit) {
        let updatedLogs = List.empty<Text>();
        habit.completionLogs.values().forEach(func(log) { updatedLogs.add(log) });
        updatedLogs.add(date);
        let updatedHabit = {
          id = habit.id;
          name = habit.name;
          createdTimestamp = habit.createdTimestamp;
          completionLogs = updatedLogs;
        };
        userData.habits.add(habit.id, updatedHabit);
      };
    };
  };

  public query ({ caller }) func getHabitCompletionLog(habitId : Nat) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get habit completion logs");
    };

    switch (users.get(caller)) {
      case (null) { [] };
      case (?userData) {
        switch (userData.habits.get(habitId)) {
          case (null) { [] };
          case (?habit) {
            habit.completionLogs.values().toArray();
          };
        };
      };
    };
  };
};
