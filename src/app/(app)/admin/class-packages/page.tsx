"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/modules/ui/button";
import Modal from "@/modules/shared/components/Modal";
import ConfirmDelete from "@/modules/shared/components/ConfirmDelete";
import CreatePackageForm from "@/modules/admin/class-packages/components/CreatePackageForm";
import Spinner from "@/modules/shared/components/Spinner";

export default function ClassPackagesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);


  async function fetchData() {
    try {
      

      const [clsRes, pkgRes] = await Promise.all([
        fetch("/api/backend/admin/classes/grade"),
        fetch("/api/backend/admin/class-packages"),
      ]);

      if (!clsRes.ok || !pkgRes.ok) {
        throw new Error("API failed");
        
      }

      const clsData = await clsRes.json();
      const pkgData = await pkgRes.json();

      setClasses(clsData);
      setPackages(pkgData);
    } catch (err) {
      toast.error("Failed to load data");
      setLoadingPackages(true);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  async function deletePackage(id: number) {
    try {
      const res = await fetch(
        `/api/backend/admin/class-packages/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Package deleted");

      fetchData();

    } catch {
      toast.error("Failed to delete");
    }
  }


  function openEdit(pkg: any) {
    setSelected(pkg);
    setPrice(pkg.totalFee);
    setEditOpen(true);
  }


  async function updatePackage() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/backend/admin/class-packages/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalFee: Number(price),
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Package updated");

      setEditOpen(false);
      fetchData();

    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  if(loadingPackages) {
    return (
      <Spinner/>
    )
  }

  // ui
  return (

    <section className="container py-8 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Class Packages
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage LMS class bundle packages & pricing
        </p>
      </div>

      {/* CREATE */}
      <div className="bg-slate-200 p-6 ">
        <h2 className="text-xl font-semibold mb-4">
          Create New Package
        </h2>

        <CreatePackageForm classes={classes || []} onCreated={fetchData} />
      </div>

      {/* LIST */}
      <div className="space-y-5">

        <h2 className="text-xl font-semibold">
          Existing Packages
        </h2>

        {packages.length === 0 ? (
          <div className="border border-dashed rounded-2xl p-10 text-center">
            No packages created yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {packages.map((pkg: any) => (
              <div
                key={pkg.id}
                className="border p-4 bg-white space-y-3 shadow-sm"
              >

                {/* HEADER */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold">
                      {pkg.name}
                    </h2>

                    <p className="text-sm text-green-600 font-semibold">
                      Rs. {pkg.totalFee}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="gray"
                      className="rounded-none"
                      onClick={() => openEdit(pkg)}
                    >
                      Edit
                    </Button>

                    <Modal>
                      <Modal.Open opens={`delete-${pkg.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-none"
                        >
                          Delete
                        </Button>
                      </Modal.Open>

                      <Modal.Window name={`delete-${pkg.id}`}>
                        <ConfirmDelete
                          resource="package"
                          onConfirm={() =>
                            deletePackage(pkg.id)
                          }
                        />
                      </Modal.Window>
                    </Modal>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2">
                  {pkg.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="text-sm border p-2 rounded"
                    >
                      {item.class.classType.name} —{" "}
                      <span className="text-slate-500">
                        {item.class.description}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 w-[400px] space-y-4">

            <h2 className="text-lg font-semibold">
              Edit Package Price
            </h2>

            <p className="text-sm text-slate-500">
              {selected?.name}
            </p>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full border-slate-400"
            />

            <div className="flex justify-end gap-2">

              <Button
                variant="secondary"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={updatePackage}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}