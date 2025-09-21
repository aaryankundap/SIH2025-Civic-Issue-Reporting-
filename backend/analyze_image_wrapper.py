
import os, json
import analyze_image as orig

BACKEND_OUTPUT = os.path.join(os.path.dirname(__file__), "output.json")

def analyze_image_file(image_path, model_name="gemini-1.5-flash"):
    # Call the analyze_image function from analyze_image.py and ensure we return a dict.
    if hasattr(orig, "analyze_image"):
        res = orig.analyze_image(image_path, model_name)
    else:
        # Try fallback names
        if hasattr(orig, "process_image"):
            res = orig.process_image(image_path, model_name)
        else:
            # last resort: try to execute and read output.json under module folder
            res = {}
            try:
                if hasattr(orig, "main"):
                    try:
                        orig.main(image_path)
                    except TypeError:
                        orig.main()
                outp = os.path.join(os.path.dirname(__file__), "output", "output.json")
                if os.path.exists(outp):
                    res = json.load(open(outp, 'r', encoding='utf-8'))
            except Exception as e:
                res = {"error": "wrapper fallback error: " + str(e)}

    # ensure serializable
    try:
        json.dumps(res)
    except Exception:
        res = {"result": str(res)}

    # save to backend/output.json
    try:
        with open(BACKEND_OUTPUT, "w", encoding="utf-8") as f:
            json.dump(res, f, indent=2)
    except Exception as e:
        print("Warning: couldn't write output.json:", e)

    return res
