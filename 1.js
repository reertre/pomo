The error in the screenshot shows that Python is still unable to locate the utils module, and there’s also an issue with pywin32_bootstrap. Let’s tackle these one at a time.

Step 1: Resolve the ModuleNotFoundError for utils

Since Python isn’t finding utils, there are a few approaches to ensure the path is correctly set.

1. Use an Absolute Path Adjustment in test.py:

Modify test.py to add the absolute path to the parent directory of utils manually:

import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.api.system import System

# Test code
system_instance = System()
active_systems = system_instance.get_all_active()
print(active_systems)



2. Run test.py with the Correct Working Directory:

Open a terminal, navigate to the root of your project (the directory containing utils), and then run:

python utils/test.py



3. Set PYTHONPATH Manually:

Set the PYTHONPATH to the root directory of your project:

set PYTHONPATH=.
python utils/test.py

This command tells Python to look in the current directory (the project root) when searching for packages like utils.




Step 2: Resolve the pywin32_bootstrap Error

The pywin32_bootstrap issue is a separate problem related to the pywin32 installation. Here’s how to fix it:

1. Reinstall pywin32:

First, uninstall any existing (potentially broken) installation:

pip uninstall pywin32

Then, install a specific version of pywin32 compatible with your Python version:

pip install pywin32==225 --trusted-host pypi.org --trusted-host files.pythonhosted.org



2. Run the Post-Install Script for pywin32:

After reinstalling, run the pywin32 post-install script to ensure proper setup:

python -m pywin32_postinstall

If this fails, make sure you’re running the command with administrator privileges.



3. Consider a Virtual Environment (Optional):

If pywin32 is not essential for your code, consider running your project in a virtual environment where you don’t need pywin32. Set up a virtual environment with only the required dependencies:

python -m venv myenv
myenv\Scripts\activate  # On Windows
pip install -r requirements.txt  # Or manually install necessary packages




After making these adjustments, try running test.py again. Let me know if the issues persist or if any new errors appear.

