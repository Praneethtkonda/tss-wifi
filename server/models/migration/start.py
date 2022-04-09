import importlib
import os

DENY_FILE_LIST = ["base.py", "start.py", "__init__.py"]


def getPy(variable):
    if ".py" in variable and variable not in DENY_FILE_LIST:
        return True
    return False


def startMigration():
    dir = os.path.dirname(os.path.realpath(__file__))
    files = os.listdir(dir)
    files = list(filter(getPy, files))
    try:
        for file in files:
            f = os.path.splitext(os.path.basename(file))[0]
            module = importlib.import_module(f".{f}", package=__package__)
            mig = module.Migration()
            mig.run()
    except Exception as e:
        print("ERROR from startMigration")
        print(e)


# startMigration()