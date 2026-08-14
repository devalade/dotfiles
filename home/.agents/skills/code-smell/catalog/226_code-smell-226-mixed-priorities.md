# Code Smell 226 - Mixed Priorities

**TL;DR:** Design and test software. It is cheaper than hardware

## Problems

- Bijection Fault

- Unexpected Defects

## Solutions

- Create accurate simulations

- Make fault-tolerant software

## Sample Code

##### Wrong

```
class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task, priority):
        self.tasks.append((task, priority))

    def execute_tasks(self):
        # No sorting

        for task, _ in self.tasks:
            task.execute()

class Task:
    def __init__(self, name):
        self.name = name

    def execute(self):
        print(f"Executing task: {self.name}")

task_manager = TaskManager()
highPriorityTask = Task("Slow down")
mediumPriorityTask = Task("Take Photos")
reviveKlaatu = Task("Klaatu barada nikto")

# unsorted
task_manager.add_task(mediumPriorityTask, 2)
task_manager.add_task(highPriorityTask, 1)
task_manager.add_task(reviveKlaatu, 3)

task_manager.execute_tasks()

```

##### Right

```
class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, task, priority):
        self.tasks.append((task, priority))

    def execute_tasks(self):
        # Sort tasks by priority (high to low)
        self.tasks.sort(key=lambda x: x[1], reverse=True)

        for task, _ in self.tasks:
            task.execute()

class Task:
    def __init__(self, name):
        self.name = name

    def execute(self):
        print(f"Executing task: {self.name}")

task_manager = TaskManager()
highPriorityTask = Task("Slow down")
mediumPriorityTask = Task("Take Photos")
reviveKlaatu = Task("Klaatu barada nikto")

# unsorted
task_manager.add_task(mediumPriorityTask, 2)
task_manager.add_task(highPriorityTask, 1)
task_manager.add_task(reviveKlaatu, 3)

task_manager.execute_tasks()

```

## Detection

[X] Manual

This is a design smell

## Tags

- Reliability

## Conclusion

Create software components and simulate real and not real conditions

## Relations

[https://maximilianocontieri.com/code-smell-198-hidden-assumptions](https://maximilianocontieri.com/code-smell-198-hidden-assumptions)