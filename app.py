from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def fifo(pages, frame_count):

    frames = []
    page_faults = 0
    page_hits = 0
    steps = []

    for page in pages:

        if page in frames:
            page_hits += 1
            status = "Hit"

        else:
            page_faults += 1
            status = "Fault"

            if len(frames) < frame_count:
                frames.append(page)
            else:
                frames.pop(0)
                frames.append(page)

        steps.append({
            "page": page,
            "frames": frames.copy(),
            "status": status
        })

    return steps, page_faults, page_hits

def lru(pages, frame_count):

    frames = []
    page_faults = 0
    page_hits = 0
    steps = []

    for page in pages:

        if page in frames:

            page_hits += 1
            status = "Hit"

            frames.remove(page)
            frames.append(page)

        else:

            page_faults += 1
            status = "Fault"

            if len(frames) < frame_count:
                frames.append(page)

            else:
               
                frames.pop(0)
                frames.append(page)

        steps.append({
            "page": page,
            "frames": frames.copy(),
            "status": status
        })

    return steps, page_faults, page_hits


def optimal(pages, frame_count):

    frames = []
    page_faults = 0
    page_hits = 0
    steps = []

    for i, page in enumerate(pages):

        if page in frames:

            page_hits += 1
            status = "Hit"

        else:

            page_faults += 1
            status = "Fault"

            if len(frames) < frame_count:

                frames.append(page)

            else:

                future_pages = pages[i + 1:]

                replace_index = 0
                farthest = -1

                for j in range(len(frames)):

                    current_page = frames[j]

                    if current_page not in future_pages:
                        replace_index = j
                        break

                    next_use = future_pages.index(current_page)

                    if next_use > farthest:
                        farthest = next_use
                        replace_index = j

                frames[replace_index] = page

        steps.append({
            "page": page,
            "frames": frames.copy(),
            "status": status
        })

    return steps, page_faults, page_hits

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/simulate", methods=["POST"])
def simulate():

    try:

        data = request.get_json()

        reference_string = data.get("referenceString")
        frame_count = int(data.get("frameCount"))
        algorithm = data.get("algorithm")

        if not reference_string:
            return jsonify({
                "error": "Reference string is required."
            }), 400

        if frame_count <= 0:
            return jsonify({
                "error": "Frame count must be greater than 0."
            }), 400

        pages = list(map(int, reference_string.split()))

        if algorithm == "FIFO":

            steps, faults, hits = fifo(
                pages,
                frame_count
            )

        elif algorithm == "LRU":

            steps, faults, hits = lru(
                pages,
                frame_count
            )

        elif algorithm == "Optimal":

            steps, faults, hits = optimal(
                pages,
                frame_count
            )

        else:

            return jsonify({
                "error": "Invalid algorithm."
            }), 400

        total = faults + hits

        hit_ratio = (
            (hits / total) * 100
            if total > 0 else 0
        )

        fault_ratio = (
            (faults / total) * 100
            if total > 0 else 0
        )

        return jsonify({

            "algorithm": algorithm,

            "referenceString": pages,

            "frameCount": frame_count,

            "steps": steps,

            "pageFaults": faults,

            "pageHits": hits,

            "hitRatio": round(hit_ratio, 2),

            "faultRatio": round(fault_ratio, 2)

        })

    except ValueError:

        return jsonify({
            "error": "Please enter numbers separated by spaces."
        }), 400

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500



if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )